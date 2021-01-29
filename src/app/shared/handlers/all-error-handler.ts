import { ErrorHandler, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/auth/auth.service';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { DialogInfoTitleEnum } from '../components/dialog-info/dialog-info-title.enum';
import { ErrorTypeEnum } from './error-type.enum';
import { IError } from './error.interface';

@Injectable()
export class AllErrorHandler implements ErrorHandler {
  constructor(
    private _matDialog: MatDialog,
    private _router: Router,
    private _authService: AuthService
  ) {}

  handleError(error: any): void {
    console.log(error);
    const iError = this.checkErrorType(error);

    if (iError.statusCode === 401) {
      let message = 'Tu sesión a expirado. Vuelva a conectarse';
      this._authService.clearAccessFromStorageAndDeleteUser();
      this._router.navigate(['/']);
      this._matDialog.open(DialogInfoComponent, {
        data: {
          title: DialogInfoTitleEnum.WARNING,
          html: message,
        },
      });
    } else {
      this._matDialog.open(DialogInfoComponent, {
        data: {
          title: DialogInfoTitleEnum.ERROR,
          html: iError.message,
        },
      });
    }
  }

  private checkErrorType(error): IError {
    if (error && error.error && error.error.response) {
      return {
        error: error.error.response.error,
        statusCode: error.error.response.statusCode,
        message: error.error.response.message,
      };
    } else {
      return {
        error: error.error,
        statusCode: error.statusCode,
        message: error.message,
      };
    }
  }
}
