const name = 'KDrive';
const disableExternal = false;
const baseURL = '';
const signup = false;
const version = '2';
const logoURL = `/img/logo.svg`;
const minAutoComplete = 2;
const debounceAutocomplete = 300;
const noAuth = false;
const loginPage = false;
const folderContentType = "application/vnd.drive.folder";
const mediaTypes = ['image', 'video', 'audio', 'blob'];
const documentTypes = ['application/pdf', 'text'];
const config = {
	apmServerUrl: '',
	authUrl: '',
	environment: '',
	supportLink: ''
};

export function checkMimeType(type) {
	for (let k = 0; k < mediaTypes.length; k++) {
		if (type.startsWith(mediaTypes[k])) {
			return true;
		}
	}

	return false;
}

export function checkDocumentPreview(type) {
	for (let k = 0; k < documentTypes.length; k++) {
		if (type.startsWith(documentTypes[k])) {
			return true;
		}
	}

	return false;
}

export async function fetchConfig() {
	const res = await fetch(`${baseURL}/api/config`);
	const conf = await res.json();
	config.apmServerUrl = conf.apmServerUrl;
	config.authUrl = conf.authUrl;
	config.environment = conf.environment;
	config.supportLink = conf.supportLink;
}

export {
  name,
  disableExternal,
  baseURL,
  debounceAutocomplete,
  minAutoComplete,
  logoURL,
  signup,
  version,
  noAuth,
	loginPage,
	folderContentType,
	config
}
