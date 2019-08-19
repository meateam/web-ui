const name = 'KDrive';
const disableExternal = false;
const baseURL = '';
const signup = false;
const version = '2';
const logoURL = `/img/logo.svg`;
const noAuth = false;
const loginPage = false;
const folderContentType = "application/vnd.drive.folder";
const config = {
	apmServerUrl: '',
	authUrl: '',
	environment: '',
	supportLink: ''
};

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
  logoURL,
  signup,
  version,
  noAuth,
	loginPage,
	folderContentType,
	config
}
