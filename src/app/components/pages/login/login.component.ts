import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/api/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private MESSAGE_AUTH_ERR: string = 'Datos incorrectos. Vuelva a intentarlo';
  private MESSAGE_AUTH_OK: string = 'Usuario identificado correctamente...';

  message: string = "---";
  auth: boolean = false;

  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {
    this._authService.validate().subscribe(
      () => {
        this._router.navigate(['map']);
      },
      () => {
        this._router.navigate(['login']);
      }
    );
  }

  ngOnInit(): void {
  }

  async login(user: string, password: string) {
    await this._authService.login(user, password).subscribe(
      res => {
        this.message = this.MESSAGE_AUTH_OK;
        this.auth = true;
        let access_token = res.access_token;
        localStorage.setItem('access_token', access_token);
        this._router.navigate(['map']);
      },
      err => {
        this.message = this.MESSAGE_AUTH_ERR;
        this.auth = false;
      });
  }

}
