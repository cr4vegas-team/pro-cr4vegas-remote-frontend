import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url: string;
  private _accessToken: string;
  private _headers: HttpHeaders;

  constructor(
    private _http: HttpClient
  ) {
    this._url = GLOBAL.API;
    this._headers = new HttpHeaders();
    this._headers = this._headers.append('Content-Type', 'application/json');
    this.loadAccessToken();
  }

  private loadAccessToken() {
    this._accessToken = localStorage.getItem('access_token');
    this._headers = this._headers.set('Authorization', 'Bearer ' + this._accessToken);
  }

  validate(): Observable<any> {
    this.loadAccessToken();
    return this._http.get(this._url + 'auth', { headers: this._headers });
  }

  login(user: string, password: string): Observable<any> {
    let body = JSON.stringify({ username: user, password });
    return this._http.post(this._url + 'auth/login', body, { headers: this._headers });
  }

  signin(user: User): Observable<any> {
    this._accessToken = localStorage.getItem('access_token');
    let body = JSON.stringify(user);
    return this._http.post(this._url + 'auth/signin', body, { headers: this._headers });
  }


}
