import { sync } from 'vuex-router-sync';
import store from '@/store';
import router from '@/router';
import i18n from '@/i18n';
import Vue from '@/utils/vue';
import { validateLogin } from '@/utils/auth';
import App from '@/App';
import { fetchConfig } from '@/utils/constants';
import { initApm } from '@/utils/apm';
import { config } from '@/utils/constants';

sync(store, router);

async function start () {
	await fetchConfig();
	await initApm(config);

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
