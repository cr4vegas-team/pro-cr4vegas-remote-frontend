import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDto } from '../../dto/user-response.dto';
import { UserRole } from '../../enum/user-role.enum';
import { UserFactoryService } from '../../user-factory.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-dialog-user-create',
  templateUrl: './dialog-user-create.component.html',
})
export class DialogUserCreateComponent implements OnInit {
  userRole = UserRole;
  userForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogUserCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDto,
    private readonly _userFactory: UserFactoryService,
    private readonly _userService: UserService
  ) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      id: new FormControl(this.data.id, [Validators.required]),
      active: new FormControl(this.data.active, [Validators.required]),
      username: new FormControl(this.data.username, [Validators.required]),
      email: new FormControl(this.data.email, [Validators.required]),
      role: new FormControl(this.data.role, [Validators.required]),
    });
  }

  public accept(): void {
    if (this.userForm.valid) {
      let userUpdateDto = this._userFactory.getUserUpdateDto(
        this.userForm.value
      );
      this._userService.update(userUpdateDto).subscribe((userRO) => {
        if (userRO && userRO.user) {
          this.dialogRef.close(userRO.user);
        }
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
