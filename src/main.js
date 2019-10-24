import { sync } from 'vuex-router-sync';
import axios from 'axios';
import VTooltip from 'v-tooltip'

import store from '@/store';
import router from '@/router';
import i18n from '@/i18n';
import Vue from '@/utils/vue';
import { validateLogin } from '@/utils/auth';
import App from '@/App';
import { fetchConfig } from '@/utils/constants';
import { initApm } from '@/utils/apm';
import { config } from '@/utils/constants';

Vue.use(VTooltip)
sync(store, router);

async function start () {
	await fetchConfig();
	await initApm(config);

	if (!validateLogin()) {
		return
	}
	
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
