import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/api/auth.service';

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
      .then(() => {
        return true;
      })
      .catch(() => {
        this._router.navigate(['login']);
        return false;
      });
  }

}
