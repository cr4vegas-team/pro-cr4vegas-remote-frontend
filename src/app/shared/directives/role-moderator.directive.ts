import { isNull } from '@angular/compiler/src/output/output_ast';
import { Directive, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/auth/auth.service';
import { UserRole } from 'src/app/modules/auth/user/enum/user-role.enum';

@Directive({
  selector: '[appRoleModerator]',
})
export class RoleModeratorDirective {
  constructor(el: ElementRef, private readonly _authService: AuthService) {
    this._authService.getUser$().subscribe((user) => {
      if (user && user.role) {
        if (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) {
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
