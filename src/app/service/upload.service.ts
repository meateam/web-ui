import { init as initApm } from '@elastic/apm-rum';
const apm = initApm({

  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'web-ui',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'http://localhost:8200',

  // Set service version (required for sourcemap feature)
  serviceVersion: 'v0.1',
  agentVersion: '4.0.1',
  distributedTracingOrigins: ["http://localhost:8080"],
  environment: 'development'
})
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http'
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

const url = `${environment.api}/upload`;

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  public upload(files: Set<File>): { [key: string]: { progress: Observable<number> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // create a http-post request and pass the form
      // tell it to report the upload progress
      if (file.size <= 5 << 20) {
        // create a new multipart-form for every file
        const formData: FormData = new FormData();
        formData.append("file", file, file.name);
        const req = new HttpRequest("POST", `${url}?uploadType=multipart`, formData, {
          reportProgress: true,
          responseType: 'text'
        });
        
        const transaction = apm.startTransaction(`POST ${url}?uploadType=multipart`, 'http');
        // send the http-request and subscribe for progress-updates
        this.http.request(req).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            // calculate the progress percentage

            const percentDone = Math.round((100 * event.loaded) / event.total);
            // pass the percentage into the progress-stream
            progress.next(percentDone);
          } else if (event instanceof HttpResponse) {
            // Close the progress-stream if we get an answer form the API
            // The upload is complete
            progress.complete();
            transaction.end();
          }
        });

        // Save every progress-observable in a map of all observables
        status[file.name] = {
          progress: progress.asObservable()
        };
      } else {
        const fileMetadata = { title: file.name, mimeType: file.type };
        const initReq = new HttpRequest("POST", `${url}`, fileMetadata, {
          responseType: 'text'
        });
        this.http.request<string>(initReq).subscribe(initEvent => {
          if (initEvent instanceof HttpResponse) {
            const uploadId = initEvent.headers.get('x-uploadid');

            const formData: FormData = new FormData();
            formData.append("file", file, file.name);
            const headers = new HttpHeaders().set('Content-Range', `bytes 0-${file.size - 1}/${file.size}`);

            const req = new HttpRequest("POST", `${url}?uploadType=resumable&uploadId=${uploadId}`, formData, {
              reportProgress: true,
              responseType: 'text',
              headers
            });

            // send the http-request
            // send the http-request and subscribe for progress-updates
            this.http.request(req).subscribe(event => {
              if (event.type === HttpEventType.UploadProgress) {
                // calculate the progress percentage

                const percentDone = Math.round((100 * event.loaded) / event.total);
                // pass the percentage into the progress-stream
                progress.next(percentDone);
              } else if (event instanceof HttpResponse) {
                if (event.ok) {
                  progress.complete();
                } else {
                  progress.error('failed uploading');
                }
              }
            });
          }
        });

        // Save every progress-observable in a map of all observables
        status[file.name] = {
          progress: progress.asObservable()
        };
      }
    });

    // return the map of progress.observables
    return status;
  }
}
