import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserEntity } from '../../models/user.entity';
import { GLOBAL } from '../../constants/global.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url: string;
  private _accessToken: string;
  private _headers: HttpHeaders;
  private _isAuthenticated: BehaviorSubject<boolean>;
  private _isAuthenticated$: Observable<boolean>;

  constructor(
    private _http: HttpClient
  ) {
    this._url = GLOBAL.API;
    this._headers = new HttpHeaders();
    this._headers = this._headers.append('Content-Type', 'application/json');
    this.loadAccessToken();
    this._isAuthenticated = new BehaviorSubject<boolean>(false);
    this._isAuthenticated$ = this._isAuthenticated.asObservable();
  }

  subscribeToAuthenticated(): Observable<boolean> {
    return this._isAuthenticated$;
  }

  loadAccessToken(): HttpHeaders {
    this._accessToken = localStorage.getItem('access_token');
    this._headers = this._headers.set('Authorization', 'Bearer ' + this._accessToken);
    return this._headers;
  }

  validate(): Observable<any> {
    this.loadAccessToken();
    const result: Observable<any> = this._http.get(this._url + 'auth', { headers: this._headers });
    result.toPromise()
      .then(() => this._isAuthenticated.next(true))
      .catch(() => this._isAuthenticated.next(false));
    return result;
  }

  login(user: string, password: string): Observable<any> {
    let body = JSON.stringify({ username: user, password });
    return this._http.post(this._url + 'auth/login', body, { headers: this._headers });
  }

  logout() {
    localStorage.removeItem('access_token');
    this._accessToken = null;
  }

  signin(user: UserEntity): Observable<any> {
    this._accessToken = localStorage.getItem('access_token');
    let body = JSON.stringify(user);
    return this._http.post(this._url + 'auth/signin', body, { headers: this._headers });
  }


}
