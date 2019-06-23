import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private cookieService: CookieService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authToken = this.cookieService.get(environment.authenticationToken);
		if (authToken) {
			req = req.clone({
				setHeaders: {
					'Authorization':
						`Bearer ${authToken}`,
				},
			});
		}

		return next.handle(req);
	}
}