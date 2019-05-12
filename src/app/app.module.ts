import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadModule } from './file-explorer/upload/upload.module';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { MatCardModule } from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpApmInterceptor } from './service/apm.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UploadModule,
    FileExplorerModule,
    MatCardModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpApmInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
