import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private _authenticated = false;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {
    this._authService.observeAuthenticated().subscribe(
      res => {
        if (res) {
          this._authenticated = true;
        } else {
          this._authenticated = false;
        }
      },
      error => {
        this._authenticated = false;
      }
    )
  }

  canActivate(): boolean {
    if (this._authenticated) {
      return true;
    } else {
      this._router.navigateByUrl('/');
      return false;
    }
  }

}
