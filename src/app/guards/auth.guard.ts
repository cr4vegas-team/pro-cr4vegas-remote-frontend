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
    
    await this._authService.checkAuth();
    let authenticated = await this._authService.isAuthenticated().getValue();
    if (authenticated) {
      return true;
    } else {
      this._router.navigateByUrl('/');
      return false;
    }
  }

}
