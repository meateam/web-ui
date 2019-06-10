import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadModule } from './file-explorer/upload/upload.module';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { MatCardModule } from '@angular/material';
import { HttpApmInterceptor } from './service/apm.interceptor';
import { FileMetadataDialogComponent } from './file-explorer/dialog/file-metadata-dialog/file-metadata-dialog.component';
import { UserService } from './service/user.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/auth.interceptor';


export function authenticateUser(userService: UserService) {
  return () => {
    if (userService.isAuthenticated) {
      return Promise.resolve(true);
    }

    document.location.href = `${environment.authenticationServiceUrl}`;
    return Promise.reject(false);
  };
}

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
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpApmInterceptor, multi: true },
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: authenticateUser, multi: true, deps: [UserService] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
