import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { FileExplorerComponent } from './file-explorer.component';
import { NewFolderDialogComponent } from './dialog/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './dialog/rename-dialog/rename-dialog.component';
import { UploadModule } from './upload/upload.module';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    UploadModule
  ],
  declarations: [FileExplorerComponent, NewFolderDialogComponent, RenameDialogComponent],
  exports: [FileExplorerComponent],
  entryComponents: [NewFolderDialogComponent, RenameDialogComponent],
})
export class FileExplorerModule {}