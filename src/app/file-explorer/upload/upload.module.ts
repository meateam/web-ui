import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatProgressBarModule,
  MatIconModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { UploadDialogComponent } from '../dialog/upload-dialog/upload-dialog.component';
import { UploadService } from '../../service/upload.service';

@NgModule({
  declarations: [UploadComponent, UploadDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatIconModule
  ],
  exports: [UploadComponent],
  entryComponents: [UploadDialogComponent],
  providers: [UploadService],
})
export class UploadModule { }
