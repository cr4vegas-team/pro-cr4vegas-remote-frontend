import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  async canActivate(): Promise<boolean> {
    return await this._authService.validate().toPromise()
      .then(() => true)
      .catch(() => {
        this._router.navigateByUrl('/');
        return false;
      });
  }

}
