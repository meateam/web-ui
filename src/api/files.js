import axios from 'axios';

import { baseURL, config, folderContentType, Roles } from '@/utils/constants'
import store from '@/store'

import { fetchURL, removePrefix } from './utils'

export async function fetch(url) {
	url = removePrefix(url);
	let data = {};

	if (url !== "") {
		// get parent folder
		const res = await fetchURL(`/api/files/${url}`, {});
		if (res.status === 200) {
			data = await res.json();
			if (data.type === folderContentType) {
				data.isDir = true;
				const res = await fetchURL(`/api/files?parent=${data.id}`, {});
				if (res.status === 200) {
					data.items = await res.json();
				}
			}
		} else {
			throw new Error(res.status);
		}
	} else {
		data.isDir = true;
		data.role = Roles.owner;
		// get files in root folder
		const res = await fetchURL(`/api/files`, {});
		if (res.status === 200) {
			data.items = await res.json();
		} else {
			throw new Error(res.status);
		}
	}

	return parseData(data);
}

async function resourceAction(url, method, content) {
	url = removePrefix(url);

	let opts = { method };

	if (content) {
		opts.body = content;
	}

	const res = await fetchURL(`/api/resources${url}`, opts);

	if (res.status !== 200) {
		throw new Error(res.responseText);
	} else {
		return res;
	}
}

export async function remove(file) {
	const res = await fetchURL(`/api/files/${file}`, { method: 'DELETE' });
	if (res.status !== 200) {
		throw new Error(res.responseText);
	} else {
		return res;
	}
}

export async function unShare(file, user) {
	const res = await fetchURL(`/api/files/${file}/permissions?userId=${user}`, { method: 'DELETE' });
	if (res.status !== 200) {
		throw new Error(res.responseText);
	} else {
		return res;
	}
}

export async function put(url, content = '') {
	return resourceAction(url, 'PUT', content)
}

export function download(files) {
	if (files.length > 0) {
		window.open(`${baseURL}/api/files/${files[0]}?alt=media`);
	}
}

export function preview(file) {
	return `${baseURL}/api/files/${file}?alt=media&preview`;
}

export function openEditOnline(fileId) {
	return `${config.docsUrl}/${fileId}`;
}

export async function getAncestors(file) {
	const ancestors = await axios.get(`${baseURL}/api/files/${file}/ancestors`, { headers: {Authorization: 'Bearer ' + store.state.jwt} });

	return ancestors ? ancestors.data : [];
}

export async function upload(url, file, headers, onupload) {
	return new Promise((resolve, reject) => {
		let request = new XMLHttpRequest();
		request.open('POST', url, true);
		request.withCredentials = true;
		for (let prop in headers) {
			request.setRequestHeader(prop, headers[prop]);
		}

		if (typeof onupload === 'function') {
			request.upload.onprogress = onupload;
		}

		// Send a message to user before closing the tab during file upload
		window.onbeforeunload = () => "Files are being uploaded.";

		request.onload = () => {
			if (request.status === 200) {
				resolve(request.responseText)
			} else if (request.status === 409) {
				reject(request.status)
			} else {
				reject(request.responseText)
			}
		}

		request.onerror = (error) => {
			reject(error)
		}

		const formData = new FormData();
		formData.append("file", file, file.name);
		request.send(formData);
		// Upload is done no more message before closing the tab 
	}).finally(() => { window.onbeforeunload = null })
}

export async function uploadInit(file) {
	return new Promise((resolve, reject) => {
		const fileMetadata = { title: file.name, mimeType: file.type };
		const url = `${baseURL}/api/upload?parent=${file.parent}`;
		const request = new XMLHttpRequest();
		const responseUploadIdHeader = 'x-uploadid';
		request.open('POST', url, true);
		request.setRequestHeader('content-type', 'application/json');
		request.setRequestHeader('X-Content-Length', `${file.size}`);
		request.setRequestHeader('Authorization', 'Bearer ' + store.state.jwt);

		request.onload = () => {
			if (request.status === 200) {
				resolve(request.getResponseHeader(responseUploadIdHeader));
			} else if (request.status === 409) {
				reject(request.status);
			} else {
				reject(request.responseText);
			}
		};

		request.onerror = (error) => {
			reject(error)
		};

		request.send(JSON.stringify(fileMetadata));
	}).finally(() => { window.onbeforeunload = null });
}

export async function post(base, file, onupload) {
	return new Promise(async (resolve, reject) => {
		const requestUploadIdHeader = 'uploadId';
		let url = `${baseURL}/api/upload`;
		let headers = {
			Authorization: 'Bearer ' + store.state.jwt
		}
		file.parent = base;
		if (file.size <= 5 << 20) {
			url += '?uploadType=multipart';
		} else {
			const uploadId = await this.uploadInit(file);
			headers['Content-Range'] = `bytes 0-${file.size - 1}/${file.size}`;
			url += `?uploadType=resumable&${requestUploadIdHeader}=${uploadId}`;
		}

		if (base) {
			url += `&parent=${base}`;
		}

		this.upload(url, file, headers, onupload).then(resolve).catch(reject);
	}).finally(() => { window.onbeforeunload = null });
}

export function uploadFolder(parent, name, onUpload) {
	return new Promise((resolve, reject) => {
		let url = `${baseURL}/api/upload?parent=${parent}&uploadType=multipart`;
		let headers = {
			"Authorization": 'Bearer ' + store.state.jwt,
			"Content-Type": folderContentType,
			"Content-Disposition": `filename=${encodeURIComponent(name)}`
		}

		let request = new XMLHttpRequest();
		request.open('POST', url, true);
		request.withCredentials = true;
		for (let prop in headers) {
			request.setRequestHeader(prop, headers[prop]);
		}

		if (typeof onupload === 'function') {
			request.upload.onprogress = onUpload;
		}

		// Send a message to user before closing the tab during file upload
		window.onbeforeunload = () => "Creating a folder.";

		request.onload = () => {
			if (request.status === 200) {
				resolve(request.responseText)
			} else if (request.status === 409) {
				reject(request.status)
			} else {
				reject(request.responseText)
			}
		}

		request.onerror = (error) => {
			reject(error)
		}
		request.send();
	}).finally(() => { window.onbeforeunload = null });
}

function moveCopy(items, copy = false) {
	let promises = []

	for (let item of items) {
		const from = removePrefix(item.from)
		const to = encodeURIComponent(removePrefix(item.to))
		const url = `${from}?action=${copy ? 'copy' : 'rename'}&destination=${to}`
		promises.push(resourceAction(url, 'PATCH'))
	}

	return Promise.all(promises)
}

export function move(items, to) {
	return new Promise((resolve, reject) => {
		let request = new XMLHttpRequest();
		request.open('PUT', `${baseURL}/api/files`, true);
		request.withCredentials = true;
		request.setRequestHeader('Authorization', 'Bearer ' + store.state.jwt);

		// Send a message to user before closing the tab during file upload
		window.onbeforeunload = () => "Moving files.";
		request.onload = () => {
      if (request.status === 200) {
				resolve(request.responseText);
      } else if (request.status === 409) {
        reject(request.status);
      } else {
        reject(request.responseText);
      }
		}
		
		request.onerror = (error) => {
      reject(error);
    }
		const body = JSON.stringify({
			partialFile: {
				parent: to
			}, 
			idList: items
		});
		request.send(body);
		// Upload is done no more message before closing the tab 
	}).finally(() => { window.onbeforeunload = null })
}

export function rename(id, name) {
	return new Promise((resolve, reject) => {
		let request = new XMLHttpRequest();
		request.open('PUT', `${baseURL}/api/files/${id}`, true);
		request.withCredentials = true;
		request.setRequestHeader('Authorization', 'Bearer ' + store.state.jwt);

		// Send a message to user before closing the tab during file upload
		window.onbeforeunload = () => "Renaming file.";

		request.onload = () => {
      if (request.status === 200) {
        resolve(request.responseText);
      } else if (request.status === 409) {
        reject(request.status);
      } else {
        reject(request.responseText);
      }
		}
		
		request.onerror = (error) => {
      reject(error);
    }

		const formData = new FormData();
		formData.append("partialFile", { name });
		request.send(JSON.stringify({ name }));
		// Upload is done no more message before closing the tab 
	}).finally(() => { window.onbeforeunload = null })
}

export function copy(items) {
	return moveCopy(items, true)
}

export async function checksum(url, algo) {
	const data = await resourceAction(`${url}?checksum=${algo}`, 'GET')
	return (await data.json()).checksums[algo]
}

export async function getPermissions(id) {
	const response = await axios.get(`${baseURL}/api/files/${id}/permissions`, { headers: {Authorization: 'Bearer ' + store.state.jwt} });
	return response.data;
}

export async function getPermits(id) {
	const response = await axios.get(`${baseURL}/api/files/${id}/permits`, { headers: {Authorization: 'Bearer ' + store.state.jwt} });
	return response.data;
}

export async function getSharedWithMe() {
	const response = await axios.get(`${baseURL}/api/files?shares`, { headers: {Authorization: 'Bearer ' + store.state.jwt} });

	const data = { items: response.data, isDir: true, role: Roles.read };
	
	return parseData(data);
}

export function parseData(data) {
	if (!data || !data.items) return data;
	let numDirs = 0;
	let numFiles = 0;
	data.size = 0;
	for (let i = 0; i < data.items.length; i++) {
		data.items[i].index = i;
		data.items[i].modified = new Date(data.items[i].updatedAt);
		delete data.items[i].updatedAt;
		data.size += data.items[i].size || 0;
		if (data.items[i].type === folderContentType) {
			numDirs++;
			data.items[i].isDir = true;
		} else {
			numFiles++;
			data.items[i].isDir = false;
		}
	}

	data.numDirs = numDirs;
	data.numFiles = numFiles;

	return data;
}
