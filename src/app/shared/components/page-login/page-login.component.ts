import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';

@Component({
  selector: 'app-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class LoginComponent implements OnInit {

  private MESSAGE_AUTH_ERR = 'Datos incorrectos. Vuelva a intentarlo';
  private MESSAGE_AUTH_OK = 'Usuario identificado correctamente...';

  message = '---';
  auth = false;
  hide = true;

  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._authService.isAuthenticated().subscribe(
      res => {
        if (res) {
          this._router.navigate(['map']);
          this.message = this.MESSAGE_AUTH_OK;

        } else {
          this.message = this.MESSAGE_AUTH_ERR;
        }
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error } });
      }
    );
    this.login('test', 'test');
  }

  login(user: string, password: string): void {
    this._authService.login(user, password);
  }

}
