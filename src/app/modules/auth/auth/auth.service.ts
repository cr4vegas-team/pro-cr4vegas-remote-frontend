import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { UserEntity } from '../user/user.entity';
import { UserCreateDto } from './../user/dto/user-create.dto';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { WSEvent } from '../user/ws-events.enum';

export const ACCESS_ITEM = 'access';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _url: string;
  private user$: BehaviorSubject<UserEntity>;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _webSocketService: WebsocketService
  ) {
    this._url = GLOBAL.API;
    try {
      const userString = localStorage.getItem('access');
      if (userString && userString !== '') {
        const access = JSON.parse(userString);
        if (access.user) {
          this.user$ = new BehaviorSubject(access.user);
        }
      } else {
        this.user$ = new BehaviorSubject(null);
      }
    } catch (e) {
      this.clearAccessFromStorageAndDeleteUser();
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
    const accessToken = this.getAccessToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      }),
      params: new HttpParams(params),
    };
  }

  private getAccessToken(): string {
    const access = localStorage.getItem('access');
    let accessToken = null;
    if (access && access !== '') {
      const accessJSON = JSON.parse(access);
      if (accessJSON.access_token) {
        accessToken = accessJSON.access_token;
      }
    }
    return accessToken;
  }

  public login(username: string, password: string): void {
    const body = JSON.stringify({ username, password });
    this._http
      .post(this._url + 'auth/login', body, this.getHttpOptions({}))
      .subscribe((res) => {
        localStorage.setItem('access', JSON.stringify(res as any));
        this.saveAccessOnStorage(JSON.stringify(res as any));
        this.getUser$().next((res as any).user);
        const eventData = JSON.stringify({
          event: WSEvent.LOGIN,
          data: this.getUser$().value,
        });

        this._webSocketService.send(eventData);
      });
  }

  public logout(): void {
    this._http
      .post(this._url + 'auth/logout', {}, this.getHttpOptions({}))
      .subscribe((res) => {
        const eventData = JSON.stringify({
          event: WSEvent.LOGOUT,
          data: this.getUser$().value,
        });

        this._webSocketService.send(eventData);
        this.clearAccessFromStorageAndDeleteUser();
      });
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

  public clearAccessFromStorageAndDeleteUser(): void {
    localStorage.removeItem(ACCESS_ITEM);
    this._router.navigate(['/login']);
    this.getUser$().next(null);
  }
}
