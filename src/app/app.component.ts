import { Component } from '@angular/core';
import { FileElement } from './file-explorer/model/file-element';
import { Observable, of } from 'rxjs';
import { FileService, FolderContentType } from './service/file.service';
import { UserService } from './service/user.service';
import { User } from './service/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web-ui';
  fileElements: Observable<FileElement[]>;
  
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;

  constructor(public fileService: FileService) {
    this.fetchFiles();
  }

  fetchFiles() {
    this.fileService.getAll().subscribe(files => {
      this.fileService.deleteAll();
      if (files == null) {
        return;
      }
      
      for (let i = 0; i < files.length; i++) {
        const file: FileElement = {
          id: files[i].id,
          name: files[i].name,
          parent: 'root',
          isFolder: files[i].type === FolderContentType,
          size: files[i].size,
          type: files[i].type,
          createdAt: new Date(files[i].createdAt),
          updatedAt: new Date(files[i].updatedAt)
        };

        this.fileService.add(file);
      }

      this.updateFileElementQuery();
    });
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  downloadFile(element: FileElement) {
    const downloadUrl = this.fileService.download(element.id);
    const anchor = document.createElement('a');
    anchor.target = '_blank';
    anchor.href = downloadUrl;
    anchor.download = element.name;
    anchor.click();
    anchor.remove();
  }

  deleteFile(element: FileElement) {
    this.fileService.delete(element.id).subscribe((deleted: boolean) => {
      if (deleted) {
        this.fetchFiles();
      }
    });
  }

  // addFolder(folder: { name: string }) {
  //   this.fileService.add({
  //     isFolder: true,
  //     fullName: folder.name,
  //     FileOrId: { Parent: this.currentRoot ? this.currentRoot.id : 'root' }
  //   });
  //   this.updateFileElementQuery();
  // }
  
  // removeElement(element: FileElement) {
  //   this.fileService.delete(element.id);
  //   this.updateFileElementQuery();
  // }
  
  // moveElement(event: { element: FileElement; moveTo: FileElement }) {
  //   this.fileService.update(event.element.id, { FileOrId: { Parent: event.moveTo.id }});
  //   this.updateFileElementQuery();
  // }
  
  // renameElement(element: FileElement) {
  //   this.fileService.update(element.id, { fullName: element.fullName });
  //   this.updateFileElementQuery();
  // }

  // navigateUp() {
  //   if (this.currentRoot && this.currentRoot.FileOrId.Parent === 'root') {
  //     this.currentRoot = null;
  //     this.canNavigateUp = false;
  //   } else {
  //     this.currentRoot = this.fileService.get(this.currentRoot.FileOrId.Parent);
  //   }

  //   this.updateFileElementQuery();
  //   this.currentPath = this.popFromPath(this.currentPath);
  // }
  
  // navigateToFolder(element: FileElement) {
  //   this.currentRoot = element;
  //   this.updateFileElementQuery();
  //   this.currentPath = this.pushToPath(this.currentPath, element.fullName);
  //   this.canNavigateUp = true;
  // }

  // pushToPath(path: string, folderName: string) {
  //   let p = path ? path : '';
  //   p += `${folderName}/`;

  //   return p;
  // }
  
  // popFromPath(path: string) {
  //   let p = path ? path : '';
  //   let split = p.split('/');
  //   split.splice(split.length - 2, 1);
  //   p = split.join('/');

  //   return p;
  // }
}
