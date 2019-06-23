import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class EnvService {
	// The values that are defined here are the default values
	public apmServerUrl = 'http://localhost:8200';
	public environment = 'production';

	constructor() { }

}

export interface IConfig {
	apmServerUrl: string;
	environment: string;
}

export const EnvServiceFactory = () => new EnvService();

export const EnvServiceProvider = {
	provide: EnvService,
	useFactory: EnvServiceFactory,
	deps: [],
};
