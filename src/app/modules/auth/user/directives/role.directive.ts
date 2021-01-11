import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserRoleEnum } from '../enum/user-role.enum';

@Directive({
  selector: '[appRole]',
})
export class RoleDirective implements OnInit {
  @Input('appRole') requiredRoles: UserRoleEnum[];

  userRole: UserRoleEnum = UserRoleEnum.NONE;
  el: ElementRef = null;

  constructor(el: ElementRef, private readonly _authService: AuthService) {
    this.el = el;
  }
  ngOnInit(): void {
    this._authService.getUser$().subscribe((user) => {
      if (user && user.role && this.requiredRoles) {
        if (this.requiredRoles.indexOf(user.role) >= 0) {
          this.el.nativeElement.hidden = false;
        } else {
          this.el.nativeElement.hidden = true;
        }
      } else {
        this.el.nativeElement.hidden = true;
      }
    });
  }
}
