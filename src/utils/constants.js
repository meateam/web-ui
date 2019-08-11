const name = 'KDrive';
const disableExternal = false;
const baseURL = '/';
const signup = false;
const version = '(untracked)';
const logoURL = `/img/logo.svg`;
const noAuth = false;
const loginPage = false;
const folderContentType = "application/vnd.drive.folder";
const config = {
	apmServerUrl: '',
	environment: '',
};

export async function fetchConfig() {
<<<<<<< HEAD
	const res = await fetch(`${baseURL}api/config`);
=======
	const res = await fetch(`${baseURL}/api/config`);
>>>>>>> develop
	const conf = await res.json();
	config.apmServerUrl = conf.apmServerUrl;
	config.environment = conf.environment;
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
