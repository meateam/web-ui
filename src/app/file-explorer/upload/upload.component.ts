import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UploadService } from '../../service/upload.service';
import { UploadDialogComponent } from '../dialog/upload-dialog/upload-dialog.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  @Output() fileUploaded = new EventEmitter();
  constructor(public dialog: MatDialog, public uploadService: UploadService) {}

  public openUploadDialog() {
    let dialogRef = this.dialog.open<UploadDialogComponent, any, boolean>(UploadDialogComponent, {
      width: '50%',
      height: '50%',
    });

    dialogRef.afterClosed().subscribe(uploadSuccess=> {
      if (uploadSuccess) {
        this.fileUploaded.emit();
      }
    });
  }
}
