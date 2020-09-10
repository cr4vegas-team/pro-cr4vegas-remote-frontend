import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SetEntity } from '../../../modules/wrap/set/set.entity';
import { SetFactory } from '../../../modules/wrap/set/set.factory';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { SetCreateDto } from './dto/set-create.dto';
import { SetTypeUpdateDto, SetUpdateDto } from './dto/set-update.dto';
import { SetTypeEntity } from './set-type.entity';
import { SetRO, SetsRO } from './set.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SetService {

  private _url: string = GLOBAL.API + 'set';

  private _sets: BehaviorSubject<SetEntity[]>;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _setFactory: SetFactory,
  ) {
    this._sets = new BehaviorSubject<SetEntity[]>(Array<SetEntity>());
  }

  public get sets(): BehaviorSubject<SetEntity[]> {
    return this._sets;
  }

  updateSets() {
    this._sets.next(this._sets.value);
  }

  // ==================================================
  // API FUNCTIONS - SET
  // ==================================================

  async findAll() {
    const httpOptions = this._authService.getHttpOptions({});
    await this._httpClient.get<SetsRO>(this._url + '/all', httpOptions).subscribe(
      setsRO => {
        this._sets.value.splice(0);
        setsRO.sets.forEach((set: SetEntity) => {
          const newSet: SetEntity = this._setFactory.createSet(set);
          this._sets.value.push(newSet);
        });
        this.updateSets();
      },
      error => {
        throw new Error(error);
      }
    );
  }

  create(setCreateDto: SetCreateDto): Observable<SetRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<SetRO>(this._url, setCreateDto, httpOptions);
  }

  update(setUpdateDto: SetUpdateDto): Observable<SetRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<SetRO>(this._url, setUpdateDto, httpOptions);
  }

  remove(set: SetEntity): Observable<boolean> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.delete<boolean>(this._url + `/${set.id}`, httpOptions);
  }

  active(set: SetEntity): Observable<boolean> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.patch<boolean>(this._url + `/${set.id}`, httpOptions);
  }

  //===========================================================
  // API FUNCTIONS - SETS-TYPES
  //===========================================================

  findAllSetTypes(): Observable<SetTypeEntity[]> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<SetTypeEntity[]>(this._url + `/set-type`, httpOptions);
  }

  createSetType(setType: SetTypeEntity): Observable<SetTypeEntity> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<SetTypeEntity>(this._url + `/set-type`, setType, httpOptions);
  }

  updateSetType(setTypeUpdateDto: SetTypeUpdateDto): Observable<SetTypeEntity> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<SetTypeEntity>(this._url + `/set-type`, setTypeUpdateDto, httpOptions);
  }

  removeSetType(setType: SetTypeEntity): Observable<boolean> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.delete<boolean>(this._url + `/set-type/${setType.name}`, httpOptions);
  }


  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================
  getOne(id: number): SetEntity {
    return this._sets.value.filter(set => set.id === id)[0];
  }

}
