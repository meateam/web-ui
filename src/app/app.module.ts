import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { init as initApm } from '@elastic/apm-rum';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadModule } from './file-explorer/upload/upload.module';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { MatCardModule } from '@angular/material';
import { HttpApmInterceptor } from './service/apm.interceptor';
import { FileMetadataDialogComponent } from './file-explorer/dialog/file-metadata-dialog/file-metadata-dialog.component';
import { UserService } from './service/user.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './service/auth.interceptor';
import { EnvServiceProvider, IConfig } from './service/env.service';

export const localStorageConfigKey = 'config';
export function authenticateUser(userService: UserService) {
	return () => {
		if (userService.isAuthenticated) {
			return Promise.resolve(true);
		}

		document.location.href = `${environment.authenticationServiceUrl}`;
		return Promise.reject(false);
	};
}

export function fetchConfig(httpClient: HttpClient) {
	return async () => {
		const localStorageConfigValue = localStorage.getItem(localStorageConfigKey);
		const apm = initApm();

		// If local storage has config already then set up apm RUM agent with it.
		if (localStorageConfigValue) {
			const config: IConfig = JSON.parse(localStorageConfigValue);

			apm.config({
				// Set custom APM Server URL (default: http://localhost:8200)
				serverUrl: config.apmServerUrl,
				// Set service version (required for sourcemap feature)
				serviceVersion: '0.1',
				agentVersion: '4.0.1',
				distributedTracingOrigins: [environment.api],
				environment: config.environment,
			});
		} else {
			// Fetch configuration and save it in local storage and set up apm RUM agent with it.
			const config = await httpClient.get<IConfig>(`${environment.api}/config`, { responseType: 'json' }).toPromise();
			localStorage.setItem(localStorageConfigKey, JSON.stringify(config));

			apm.config({
				// Set custom APM Server URL (default: http://localhost:8200)
				serverUrl: config.apmServerUrl,
				// Set service version (required for sourcemap feature)
				serviceVersion: '0.1',
				agentVersion: '4.0.1',
				distributedTracingOrigins: [environment.api],
				environment: config.environment,
			});
		}
	}
}

@NgModule({
	declarations: [
		AppComponent,
		FileMetadataDialogComponent
	],
	imports: [
		BrowserModule,
		UploadModule,
		FileExplorerModule,
		MatCardModule,
		AppRoutingModule
	],
	providers: [
		{ provide: APP_INITIALIZER, useFactory: fetchConfig, multi: true, deps: [HttpClient] },
		{ provide: HTTP_INTERCEPTORS, useClass: HttpApmInterceptor, multi: true },
		CookieService,
		EnvServiceProvider,
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		{ provide: APP_INITIALIZER, useFactory: authenticateUser, multi: true, deps: [UserService] },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
