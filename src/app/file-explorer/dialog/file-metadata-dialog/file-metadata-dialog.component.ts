import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-file-metadata-dialog',
  templateUrl: './file-metadata-dialog.component.html',
  styleUrls: ['./file-metadata-dialog.component.scss']
})
export class FileMetadataDialogComponent {
  constructor(public dialogRef: MatDialogRef<FileMetadataDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

}
