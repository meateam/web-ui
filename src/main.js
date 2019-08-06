import { sync } from 'vuex-router-sync';
import store from '@/store';
import router from '@/router';
import i18n from '@/i18n';
import Vue from '@/utils/vue';
import { validateLogin } from '@/utils/auth';
import App from '@/App';
import { baseURL } from '@/utils/constants';
import config from './utils/config';

export const localStorageConfigKey = 'config';
sync(store, router);

async function start () {
	let conf = localStorage.getItem(localStorageConfigKey);
	if (conf) {
		conf = JSON.parse(conf);
	} else {
		const res = await fetch(`${baseURL}/api/config`);
		conf = await res.json();
		localStorage.setItem(localStorageConfigKey, JSON.stringify(conf));
	}

	config.apmServerUrl = conf.apmServerUrl;
	config.environment = conf.environment;

	await validateLogin();
	new Vue({
		el: '#app',
		store,
		router,
		i18n,
		template: '<App/>',
		components: { App }
	});
}

start();
