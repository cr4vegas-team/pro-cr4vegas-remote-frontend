import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../modules/auth/auth/auth.service';
import { UserRoleEnum } from '../../../modules/auth/user/enum/user-role.enum';
import { ErrorTypeEnum } from '../../constants/error-type.enum';
import { DialogInfoTitleEnum } from '../dialog-info/dialog-info-title.enum';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { UserCreateDto } from '../../../modules/auth/user/dto/user-create.dto';

export function validateEmailAndPass(
  otherControl: AbstractControl
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value: any = control.value;
    const otherValue: any = otherControl.value;
    return otherValue === value ? null : { notEquals: { value, otherValue } };
  };
}
@Component({
  selector: 'app-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css'],
})
export class LoginComponent implements OnInit {
  private MESSAGE_AUTH_ERR =
    'El usuario o la contraseña no coinciden. Vuelva a intentarlo';
  private MESSAGE_SIGNIN_ERR =
    'Datos de registro incorrectos. Vuelva a intentarlo';

  loginMessage = '---';
  signinMessage = '---';
  userAuthenticated = false;
  userRolePermission = false;
  hide = true;
  hidePassword = true;
  hidePasswordTwo = true;
  init = true;

  loginForm: FormGroup;
  signinForm: FormGroup;

  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _matDialog: MatDialog,
    private readonly _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this._authService.getUser$().subscribe(
      (user) => {
        if (user !== null) {
          this.userAuthenticated = true;
          this.checkRolePermission(user.role);
        } else {
          this.userAuthenticated = false;
          this.loginMessage = this.MESSAGE_AUTH_ERR;
        }

        if (this.init) {
          this.init = false;
          this.loginMessage = "---";
        }
      },
      (error) => {
        this._matDialog.open(DialogInfoComponent, {
          data: { title: 'Error', html: error },
        });
      }
    );

    document.body.addEventListener('keyup', (event) => {
      if (event.code === 'Enter') {
        document.getElementById('button-login').click();
      }
    });

    this.loginForm = this._formBuilder.group({
      loginUser: new FormControl('', Validators.required),
      loginPassword: new FormControl('', Validators.required),
    });

    this.signinForm = this._formBuilder.group({
      signinUser: new FormControl('', Validators.required),
      signinEmail: new FormControl('', [Validators.required, Validators.email]),
      signinEmailTwo: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      signinPassword: new FormControl('', Validators.required),
      signinPasswordTwo: new FormControl('', Validators.required),
    });

    this.signinForm
      .get('signinEmailTwo')
      .setValidators(validateEmailAndPass(this.signinForm.get('signinEmail')));
    this.signinForm
      .get('signinPasswordTwo')
      .setValidators(
        validateEmailAndPass(this.signinForm.get('signinPassword'))
      );
  }

  private checkRolePermission(userRole: UserRoleEnum) {
    if (userRole && userRole !== UserRoleEnum.NONE) {
      this.userRolePermission = true;
      this._router.navigate(['/map']);
    } else {
      this.userRolePermission = false;
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      this._authService.login(
        this.loginForm.get('loginUser').value,
        this.loginForm.get('loginPassword').value
      ).subscribe(
        (res) => {
          localStorage.setItem('access', JSON.stringify(res as any));
          this._authService.saveAccessOnStorage(JSON.stringify(res as any));
          this._authService.getUser$().next((res as any).user);
        },
        error => {
          this._matDialog.open(DialogInfoComponent, {
            data: {
              errorType: ErrorTypeEnum.API_ERROR,
              title: DialogInfoTitleEnum.ERROR,
              html: error,
            },
          })
        });
    } else {
      this.loginMessage = this.MESSAGE_AUTH_ERR;
    }
  }

  logout(): void {
    this._authService.logout().subscribe((res) => {
      if (res) {
        this._authService.clearAccessFromStorage();
        this._authService.getUser$().next(null);
        this._router.navigateByUrl('/');
      }
    },
      error => {
        this._matDialog.open(DialogInfoComponent, {
          data: {
            errorType: ErrorTypeEnum.API_ERROR,
            title: DialogInfoTitleEnum.ERROR,
            html: error,
          },
        })
      });
  }

  signin(): void {
    if (this.signinForm.valid) {
      let userCreateDto = new UserCreateDto();
      userCreateDto.username = this.signinForm.get('signinUser').value;
      userCreateDto.email = this.signinForm.get('signinEmail').value;
      userCreateDto.password = this.signinForm.get('signinPassword').value;
      this._authService.signin(userCreateDto).subscribe((userRO) => {
        let user = userRO.user;
        this._matDialog.open(DialogInfoComponent, {
          data: {
            errorType: ErrorTypeEnum.FRONT_ERROR,
            title: DialogInfoTitleEnum.INFO,
            html: `
                <h3>¡Usuario registrado correctamente!</h3>
                <p><b>Id:</b> ${user.id}</p>
                <p><b>Usuario:</b> ${user.username}</p>
                <p><b>Email:</b> ${user.email}</p>
                <p><b>Rol:</b> ${user.role}</p>
                <p><b>Activo:</b> ${user.active}</p>
        `,
          },
        });
      });
    } else {
      this.signinMessage = this.MESSAGE_SIGNIN_ERR;
    }
  }
}
