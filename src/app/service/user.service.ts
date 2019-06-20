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
			return parseJwt(token);
		}

		return null;
  }
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload) as User;
};
