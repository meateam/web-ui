const name = 'KDrive';
const disableExternal = false;
const baseURL = 'http://localhost:8080';
const signup = false;
const version = '2';
const logoURL = `/img/drive_logo.svg`;
const plusURL = `/img/plus.png`;
const minAutoComplete = 2;
const noAuth = false;
const loginPage = false;
const folderContentType = "application/vnd.drive.folder";
const mediaTypes = ['image', 'video', 'audio', 'blob'];
const documentTypes = [
	'text',
	"application/msword",
	'application/vnd.ms-excel',
	'application/rtf',
	'application/vnd.oasis.opendocument.text',
	'application/vnd.oasis.opendocument.presentation',
	'application/pdf',
	'application/vnd.ms-powerpoint'
];
const documentEditTypes = [
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];
const config = {
	apmServerUrl: '',
	authUrl: '',
	docsUrl: '',
	environment: '',
	supportLink: '',
	approvalServiceUrl: '',
	externalShareName: 'שיתוף חיצוני',
	myExternalSharesName: 'השיתופים החיצוניים שלי',
	enableExternalShare: false,
};

const allowedFileTypes = ['png', 'xlsx', 'docx', 'jpg', 'pptx', 'txt', 'jpeg', 'mp4', 'mpg', 'mpeg', 'bmp', 'gif', 'wav', 'wave', 'pdf'];

export const debounceTime = 200;

export const Roles = {
	owner: "OWNER",
	write: "WRITE",
	read: "READ"
};

export function DownloadRole(role) {
	return Object.values(Roles).findIndex(r => r === role) >= 0;
}

export function PreviewRole(role) {
	return Object.values(Roles).findIndex(r => r === role) >= 0;
}

export function InfoRole(role) {
	return Object.values(Roles).findIndex(r => r === role) >= 0;
}

export function UploadRole(role) {
	return role == Roles.write || role == Roles.owner;
}

export function DeleteRole(role) {
	return role == Roles.write || role == Roles.owner || role == Roles.read ;
}

export function ShareRole(role) {
	return role == Roles.write || role == Roles.owner;
}

export function RenameRole(role) {
	return role == Roles.write || role == Roles.owner;
}

export function MoveRole(role) {
	return role == Roles.write || role == Roles.owner;
}

export function checkMimeType(type) {
	for (let k = 0; k < mediaTypes.length; k++) {
		if (type.startsWith(mediaTypes[k])) {
			return true;
		}
	}
	return false;
}

export function checkDocumentPreview(type) {
	return documentTypes.includes(type);
}

export function canEditOnline(type) {
	return documentEditTypes.includes(type);
}

export async function fetchConfig() {
	const res = await fetch(`${baseURL}/api/config`);
	const conf = await res.json();
	config.apmServerUrl = conf.apmServerUrl;
	config.authUrl = conf.authUrl;
	config.docsUrl = conf.docsUrl;
	config.environment = conf.environment;
	config.supportLink = conf.supportLink;
	config.approvalServiceUrl = conf.approvalServiceUrl || config.supportLink;
	config.externalShareName = conf.externalShareName;
	config.myExternalSharesName = conf.myExternalSharesName;
	config.enableExternalShare = conf.enableExternalShare === "true";
}

export {
	allowedFileTypes,
	name,
	disableExternal,
	baseURL,
	minAutoComplete,
	logoURL,
	plusURL,
	signup,
	version,
	noAuth,
	loginPage,
	folderContentType,
	config
}
