import { init as initApm } from '@elastic/apm-rum';
const apm = initApm({

  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'web-ui',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: EnvServiceFactory().apmServerUrl,

  // Set service version (required for sourcemap feature)
  serviceVersion: '0.1',
  agentVersion: '4.0.1',
  distributedTracingOrigins: [environment.api],
  environment: EnvServiceFactory().environment,
})
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
import { EnvServiceFactory } from './env.service';
import { environment } from 'src/environments/environment';
@Injectable()
export class HttpApmInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const transaction = apm.startTransaction(`${request.method} ${request.url}`, 'http');
    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        transaction.end();
      }

      return event;
    }));
  }
}