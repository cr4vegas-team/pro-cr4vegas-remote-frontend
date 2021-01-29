import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../auth/auth/auth.service';
import { SetCreateDto } from './dto/set-create.dto';
import { SetTypeUpdateDto, SetUpdateDto } from './dto/set-update.dto';
import { SetTypeEntity } from './set-type.entity';
import { SetRO, SetsRO } from './set.interfaces';

@Injectable({
  providedIn: 'root',
})
export class SetService {
  // ==================================================
  //  VARS CONSTANTS
  // ==================================================
  private _url: string = GLOBAL.API + 'set';

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
  ) {}

  // ==================================================
  // API FUNCTIONS - SET
  // ==================================================
  public findAll(): Observable<SetsRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<SetsRO>(this._url + '/all', httpOptions);
  }

  public create(setCreateDto: SetCreateDto): Observable<SetRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<SetRO>(this._url, setCreateDto, httpOptions);
  }

  public update(setUpdateDto: SetUpdateDto): Observable<SetRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<SetRO>(this._url, setUpdateDto, httpOptions);
  }

  // ===========================================================
  //  API FUNCTIONS SETS-TYPES
  // ===========================================================
  public findAllSetTypes(): Observable<SetTypeEntity[]> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<SetTypeEntity[]>(
      this._url + `/set-type`,
      httpOptions
    );
  }

  public createSetType(setType: SetTypeEntity): Observable<SetTypeEntity> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<SetTypeEntity>(
      this._url + `/set-type`,
      setType,
      httpOptions
    );
  }

  public updateSetType(
    setTypeUpdateDto: SetTypeUpdateDto
  ): Observable<SetTypeEntity> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<SetTypeEntity>(
      this._url + `/set-type`,
      setTypeUpdateDto,
      httpOptions
    );
  }

  public removeSetType(setType: SetTypeEntity): Observable<boolean> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.delete<boolean>(
      this._url + `/set-type/${setType.name}`,
      httpOptions
    );
  }
}
