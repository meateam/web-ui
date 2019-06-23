import { init as initApm } from '@elastic/apm-rum';
import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpApmInterceptor implements HttpInterceptor {
	public apm = initApm();
	constructor() { }
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (!this.apm) {
			return next.handle(request);
		}

		const transaction = this.apm.startTransaction(`${request.method} ${request.url}`, 'http');
		return next.handle(request).pipe(map((event: HttpEvent<any>) => {
			if (event instanceof HttpResponse) {
				transaction.end();
			}

			return event;
		}));
	}
}