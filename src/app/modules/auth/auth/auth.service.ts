import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { UserEntity } from '../user/user.entity';
import { UserCreateDto } from './../user/dto/user-create.dto';

export const ACCESS_ITEM = 'access';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _url: string;
  private user$: BehaviorSubject<UserEntity>;

  constructor(private _http: HttpClient) {
    this._url = GLOBAL.API;
    try {
      const userString = localStorage.getItem('access');
      if (userString && userString != "") {
        const access = JSON.parse(userString);
        if (access.user) {
          this.user$ = new BehaviorSubject(access.user);
        }
      } else {
        this.user$ = new BehaviorSubject(null);
      }
    } catch (e) {
      this.clearAccessFromStorage();
      this.user$ = new BehaviorSubject(null);
    }

  }

  public getUser$(): BehaviorSubject<UserEntity> {
    return this.user$;
  }

  public getHttpOptions(params: {}): {
    headers: HttpHeaders;
    params?: HttpParams;
  } {
    const access = localStorage.getItem('access');
    let accessToken = "";
    if (access && access != "") {
      const accessJSON = JSON.parse(access);
      if (accessJSON.access_token) {
        accessToken = accessJSON.access_token;
      }
    }
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      }),
      params: new HttpParams(params),
    };
  }

  public login(username: string, password: string): Observable<any> {
    const body = JSON.stringify({ username, password });
    return this._http
      .post(this._url + 'auth/login', body, this.getHttpOptions({}));
  }

  public logout(): Observable<any> {
    return this._http.post(
      this._url + 'auth/logout',
      {},
      this.getHttpOptions({}));
  }

  public signin(dto: UserCreateDto): Observable<any> {
    return this._http.post(
      this._url + 'auth/signin',
      dto,
      this.getHttpOptions({})
    );
  }

  public saveAccessOnStorage(accessItem: string): void {
    localStorage.setItem(ACCESS_ITEM, accessItem);
  }

  public clearAccessFromStorage(): void {
    localStorage.removeItem(ACCESS_ITEM);
  }
}
