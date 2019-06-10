import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { User } from './models/user.model';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private cookieService: CookieService) { }

	public get isAuthenticated(): boolean {
		return this.cookieService.check(environment.authenticationToken);
	}

	public get currentUser(): User {
		const token = this.cookieService.get(environment.authenticationToken);
		if (token) {
			const tokenData = token.split('.')[1];
			const decodedData = window.atob(tokenData);

			return JSON.parse(decodedData) as User;
		}

		return null;
	}
}
