import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from '../constants/global.constant';
import { UserEntity } from '../models/user.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url: string;

  private _isAuthenticated: BehaviorSubject<boolean>;
  private _httpOptions: { headers: HttpHeaders, params?: HttpParams };

  constructor(
    private _http: HttpClient
  ) {
    this._url = GLOBAL.API;
    this._isAuthenticated = new BehaviorSubject<boolean>(false);
    this._httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  }

  observeAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  getHttpOptions(params: boolean): { headers: HttpHeaders, params?: HttpParams } {
    if (params) {
      return { headers: this._httpOptions.headers, params: new HttpParams() };
    }
    return { headers: this._httpOptions.headers };
  }

  login(user: string, password: string) {
    let body = JSON.stringify({ username: user, password });
    this._http.post(this._url + 'auth/login', body, this._httpOptions).subscribe(
      res => {
        let access_token = (res as any).access_token;

        localStorage.setItem('access_token', access_token);
        this._httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          })
        };
        this._isAuthenticated.next(true);
      },
      err => {
        this.logout();
      }
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this._httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    this._isAuthenticated.next(false);
  }

  signin(user: UserEntity): Observable<any> {
    return this._http.post(this._url + 'auth/signin', user, this._httpOptions);
  }

}
