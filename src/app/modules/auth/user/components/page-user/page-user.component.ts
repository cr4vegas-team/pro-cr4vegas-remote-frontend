import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserDto } from '../../dto/user-response.dto';
import { UserRole } from '../../enum/user-role.enum';
import { UserService } from '../../user.service';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';

@Component({
  selector: 'app-page-user',
  templateUrl: './page-user.component.html',
})
export class PageUserComponent implements OnInit {
  userRole = UserRole;
  searchText;
  checkedCommunication = false;
  checkedActive = true;
  showLoader = false;
  users: UserDto[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _userService: UserService,
    private readonly _matDialog: MatDialog
  ) {
    this._userService.findAll().subscribe((usersRO) => {
      if (usersRO && usersRO.users) {
        this.users = usersRO.users;
      }
    });
  }

  ngOnInit(): void {}

  applyFilter(searchText: string): void {
    this.searchText = searchText;
  }

  public openDialogUser(user: UserDto): void {
    this._matDialog
      .open(DialogUserComponent, { data: user })
      .afterClosed()
      .subscribe(() => {
        this._userService.findAll().subscribe((usersRO) => {
          if (usersRO && usersRO.users) {
            this.users = usersRO.users;
          }
        });
      });
  }
}
