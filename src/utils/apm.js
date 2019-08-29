import { init } from '@elastic/apm-rum';
import { baseURL } from '@/utils/constants';

export let apm = undefined;

export function initApm(config) {
	apm = init();
	apm.config({
		serviceName: 'web-ui',
		// Set custom APM Server URL (default: http://localhost:8200)
		serverUrl: config.apmServerUrl,
		// Set service version (required for sourcemap feature)
		serviceVersion: '0.1',
		agentVersion: '4.4.1',
		distributedTracingOrigins: [`${baseURL}/api`],
		environment: config.environment,
	});
	apm.setInitialPageLoadName('index');
}