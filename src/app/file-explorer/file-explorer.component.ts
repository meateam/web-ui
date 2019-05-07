import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileElement } from './model/file-element';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { NewFolderDialogComponent } from './dialog/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './dialog/rename-dialog/rename-dialog.component';

@Component({
  selector: 'file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent {
  constructor(public dialog: MatDialog) {}
  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: string;
  @Input() path: string;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{
    element: FileElement
    moveTo: FileElement
  }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();
  @Output() fileAdded = new EventEmitter();
  @Output() downloadFile = new EventEmitter<FileElement>();

  openMenu(event: MouseEvent, element: FileElement, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  refreshFiles() {
    this.fileAdded.emit()
  }

  elementDownload(element: FileElement) {
    this.downloadFile.emit(element);
  }
  
  // deleteElement(element: FileElement) {
  //   this.elementRemoved.emit(element);
  // }

  // navigate(element: FileElement) {
  //   if (element.isFolder) {
  //     this.navigatedDown.emit(element);
  //   }
  // }

  // navigateUp() {
  //   this.navigatedUp.emit();
  // }

  // moveElement(element: FileElement, moveTo: FileElement) {
  //   this.elementMoved.emit({ element: element, moveTo: moveTo });
  // }

  // openNewFolderDialog() {
  //   let dialogRef = this.dialog.open(NewFolderDialogComponent);
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res) {
  //       this.folderAdded.emit({ name: res });
  //     }
  //   });
  // }
  
  // openRenameDialog(element: FileElement) {
  //   let dialogRef = this.dialog.open(RenameDialogComponent);
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res) {
  //       element.fullName = res;
  //       this.elementRenamed.emit(element);
  //     }
  //   });
  // }
}