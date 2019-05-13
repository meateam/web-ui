import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadModule } from './file-explorer/upload/upload.module';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { MatCardModule } from '@angular/material';
import { FileMetadataDialogComponent } from './file-explorer/dialog/file-metadata-dialog/file-metadata-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    FileMetadataDialogComponent
  ],
  imports: [
    BrowserModule,
    UploadModule,
    FileExplorerModule,
    MatCardModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
