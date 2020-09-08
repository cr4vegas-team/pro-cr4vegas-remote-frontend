import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class LoginComponent implements OnInit {

  private MESSAGE_AUTH_ERR: string = 'Datos incorrectos. Vuelva a intentarlo';
  private MESSAGE_AUTH_OK: string = 'Usuario identificado correctamente...';

  message: string = "---";
  auth: boolean = false;
  hide: boolean = true;

  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._authService.observeAuthenticated().subscribe(
      async res => {
        if (res) {
          this._router.navigate(['map']);
          this.message = this.MESSAGE_AUTH_OK;
        } else {
          this.message = this.MESSAGE_AUTH_ERR;
        }
      },
      err => {
        this.message = this.MESSAGE_AUTH_ERR;
      }
    );
    this.login('test', 'test');
  }

  async login(user: string, password: string) {
    await this._authService.login(user, password)
  }

}
