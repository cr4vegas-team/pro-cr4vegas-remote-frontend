import { UserRoleEnum } from './../constants/user-role.enum';
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

  private userRole$: BehaviorSubject<UserRoleEnum>;
  private adminOrModerator$: BehaviorSubject<boolean>;

  constructor(private _http: HttpClient) {
    this._url = GLOBAL.API;
    this.userRole$ = new BehaviorSubject(null);
    this.adminOrModerator$ = new BehaviorSubject(false);
    this.userRole$.subscribe((role) => {
      if (role === UserRoleEnum.ADMIN || role === UserRoleEnum.MODERATOR) {
        this.adminOrModerator$.next(true);
      } else {
        this.adminOrModerator$.next(false);
      }
    });
  }

  public getSubjectUserRole(): BehaviorSubject<UserRoleEnum> {
    return this.userRole$;
  }

  public getSubjectAdminOrModerator(): BehaviorSubject<boolean> {
    return this.adminOrModerator$;
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

          localStorage.setItem('access_token', access_token);
          this.userRole$.next((res as any).role);
        },
        (error) => {
          this.userRole$.next(null);
          console.log('Usuario o contraseña incorrectos');
        }
    );
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    this.userRole$.next(null);
  }

  public signin(user: UserEntity): Observable<any> {
    return this._http.post(
      this._url + 'auth/signin',
      user,
      this.getHttpOptions({})
    );
  }
}
