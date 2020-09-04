import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { UnitFactory } from './unit.factory';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private _url: string = GLOBAL.API + 'unit';

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitFactory: UnitFactory,
  ) { }

  public get unitFactory(): UnitFactory {
    return this._unitFactory;
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  public remove(id: number): Observable<boolean> {
    const httpOptions = this._authService.getHttpOptions(false);
    return this._httpClient.delete<boolean>(this._url + `/${id}`, httpOptions);
  }

  public active(id: number): Observable<boolean> {
    const httpOptions = this._authService.getHttpOptions(false);
    return this._httpClient.patch<boolean>(this._url + `/${id}`, httpOptions);
  }

}
