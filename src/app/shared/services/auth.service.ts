import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from '../constants/global.constant';
import { UserEntity } from '../models/user.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _url: string;

  private authenticated: BehaviorSubject<boolean>;

  constructor(private _http: HttpClient) {
    this._url = GLOBAL.API;
    this.authenticated = new BehaviorSubject(false);
  }

  isAuthenticated(): BehaviorSubject<boolean> {
    return this.authenticated;
  }

  getHttpOptions(params: {}): { headers: HttpHeaders; params?: HttpParams } {
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

          localStorage.setItem('access_token', access_token);
          this.authenticated.next(true);
        },
        (error) => {
          throw new Error(error);
        }
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.authenticated.next(false);
  }

  signin(user: UserEntity): Observable<any> {
    return this._http.post(
      this._url + 'auth/signin',
      user,
      this.getHttpOptions({})
    );
  }
}
