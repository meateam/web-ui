import { Injectable } from '@angular/core';
import { FileElement } from '../file-explorer/model/file-element';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface IFileService {
  add(fileElement: FileElement);
  delete(id: string);
  update(id: string, update: Partial<FileElement>);
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
  getAll(): Observable<FileElement[]>;
}

@Injectable({
  providedIn: 'root'
})
export class FileService implements IFileService {
  private map = new Map<string, FileElement>();

  constructor(public http: HttpClient) {}

  add(fileElement: FileElement) {
    this.map.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }

  delete(id: string) {
    this.map.delete(id);
  }

  update(id: string, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);
    this.map.set(element.id, element);
  }

  private querySubject: BehaviorSubject<FileElement[]>;
  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.FileOrId.Parent === folderId) {
        result.push(this.clone(element))
      }
    });

    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }

    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  getAll() {
    return this.http.get<FileElement[]>(`${environment.api}/files`, { responseType: 'json' });
  }

  download(id: string) {
    return `${environment.api}/files/${id}?alt=media`;
  }

  deleteAll() {
    this.map = new Map<string, FileElement>();
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }
}
