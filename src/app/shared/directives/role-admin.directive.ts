import { Directive, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/auth/auth.service';
import { UserRole } from 'src/app/modules/auth/user/enum/user-role.enum';

@Directive({
  selector: '[appRoleAdmin]',
})
export class RoleAdminDirective {
  constructor(el: ElementRef, private readonly _authService: AuthService) {
    this._authService.getUser$().subscribe((user) => {
      if (user && user.role) {
        if (user.role === UserRole.ADMIN) {
          el.nativeElement.hidden = false;
        } else {
          el.nativeElement.hidden = true;
        }
      } else {
        el.nativeElement.hidden = true;
      }
    });
  }
}
