import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { AuthService } from '../auth/auth.service';
import { UserRO, UsersRO } from './dto/user-response.dto';
import { UserRoleUpdateDto } from './dto/user-role-update.dto';
import { UpdateUserDto } from './dto/user-update.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // ==================================================
  //  VARS CONSTANT
  // ==================================================
  private _url: string = GLOBAL.API + 'user';
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService
  ) {}

  // ==================================================
  //  API FUNCTIONS
  // ==================================================
  public findAll(): Observable<UsersRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<UsersRO>(this._url, httpOptions);
  }

  public findOneById(id: number): Observable<UserRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<UserRO>(this._url + '/' + id, httpOptions);
  }

  public update(userDto: UpdateUserDto): Observable<UserRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<UserRO>(this._url, userDto, httpOptions);
  }

  public updateUserRole(
    userRoleUpdateDto: UserRoleUpdateDto
  ): Observable<UserRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<UserRO>(
      this._url,
      userRoleUpdateDto,
      httpOptions
    );
  }
}
