import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from '../../constants/global.constant';
import { UserEntity } from '../user/user.entity';
import { UserCreateDto } from './../user/dto/user-create.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _url: string;
  private user$: BehaviorSubject<UserEntity>;

  constructor(private _http: HttpClient) {
    this._url = GLOBAL.API;
    const userString = localStorage.getItem('user');
    if (userString && userString != "") {
      const user = JSON.parse(userString);
      this.user$ = new BehaviorSubject(user);
    } else {
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
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      }),
      params: new HttpParams(params),
    };
  }

  login(user: string, password: string): void {
    const body = JSON.stringify({ username: user, password });
    this._http
      .post(this._url + 'auth/login', body, this.getHttpOptions({}))
      .subscribe(
        (res) => {

          const access_token = (res as any).access_token;
          const user = (res as any).user;

          localStorage.setItem('access_token', access_token);
          localStorage.setItem('user', JSON.stringify(user));

          this.user$.next(user);
        },
        (error) => {
          this.user$.next(null);
          console.log('Usuario o contraseña incorrectos');
        }
      );
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.user$.next(null);
  }

  public signin(dto: UserCreateDto): Observable<any> {
    return this._http.post(
      this._url + 'auth/signin',
      dto,
      this.getHttpOptions({})
    );
  }
}
