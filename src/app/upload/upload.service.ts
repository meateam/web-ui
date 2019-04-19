import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpHeaders,
  HttpEvent,
} from '@angular/common/http'
import { Subject, Observable, forkJoin } from 'rxjs'
import { environment } from 'src/environments/environment.prod';

const url = `${environment.api}/upload`

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
          }
        });

        // Save every progress-observable in a map of all observables
        status[file.name] = {
          progress: progress.asObservable()
        };
      } else {
        const initReqHeaders = new HttpHeaders().set('Content-Type', file.type);
        const initReq = new HttpRequest("POST", `${url}`, undefined, {
          responseType: 'text',
          headers: initReqHeaders
        });
        this.http.request<string>(initReq).subscribe(initEvent => {
          if (initEvent instanceof HttpResponse) {
            const uploadId = initEvent.body;
            let chunkSize = (file.size / 50) | 0;
            if (chunkSize < 5 << 20) { // Min chunkSize is 5MB
              chunkSize = 5 << 20;
            }

            if (chunkSize > 5000 << 20) { // Max chunkSize is 5GB
              chunkSize = 5000 << 20;
            }

            let uploadedBytes = 0;
            let totalChunks = (file.size / chunkSize) | 0;
            if (file.size % chunkSize != 0) {
              totalChunks++;
            }

            const chunksRequests: Observable<HttpEvent<{}>>[] = [];
            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
              // create a new multipart-form for every file part
              const chunkStart = chunkIndex * chunkSize;
              let chunkEnd = chunkStart + chunkSize;
              if (chunkEnd > file.size) {
                chunkEnd = file.size;
              }

              const part = file.slice(chunkStart, chunkEnd, file.type);
              const formData: FormData = new FormData();
              formData.append("file", part, file.name);
              formData.append('uploadId', uploadId);
              formData.append('chunkIndex', `${chunkIndex + 1}`);

              const partReq = new HttpRequest("POST", `${url}?uploadType=resumable`, formData, {
                reportProgress: true,
                responseType: 'text'
              });

              // send the http-request
              const chunkReqObservable = this.http.request(partReq);
              chunksRequests.push(chunkReqObservable);
              chunkReqObservable.subscribe(undefined, undefined, () => {
                uploadedBytes += chunkSize;
                // calculate the progress percentage

                const percentDone = Math.round((100 * uploadedBytes) / file.size);
                // pass the percentage into the progress-stream
                progress.next(percentDone);
                return event;
              });
            }

            forkJoin(chunksRequests).subscribe(events => {
              const completeReqHeaders = new HttpHeaders().set('Content-Disposition', `filename=${file.name}`)
              const completeReq = new HttpRequest("PUT", `${url}?uploadId=${uploadId}`, undefined, {
                responseType: 'text',
                headers: completeReqHeaders
              });
              this.http.request(completeReq).subscribe(event => {
                if (event instanceof HttpResponse) {
                  // Close the progress-stream if we get an answer form the API
                  // The upload is complete
                  progress.complete();
                }
              });
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
