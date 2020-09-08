import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { SetEntity } from '../../../modules/wrap/set/set.entity';
import { SetFactory } from '../../../modules/wrap/set/set.factory';
import { AuthService } from '../../../shared/services/auth.service';
import { SetCreateDto } from './dto/set-create.dto';
import { SetUpdateDto } from './dto/set-update.dto';
import { SetTypeEntity } from './set-type.entity';
import { SetRO, SetsRO } from './set.interfaces';
import { DialogService } from 'src/app/shared/services/dialog.service';

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
    private readonly _dialogService: DialogService,
  ) {
    this._sets = new BehaviorSubject<SetEntity[]>(Array<SetEntity>());
    this._authService.observeAuthenticated().subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.findAll();
        }
      }
    );
  }

  subscribeToSets(): BehaviorSubject<SetEntity[]> {
    return this._sets;
  }

  updateSets() {
    this._sets.next(this._sets.value);
  }

  // ==================================================
  // API FUNCTIONS - SET
  // ==================================================

  async findAll(active?: number) {
    const httpOptions = this._authService.getHttpOptions(active ? true : false);
    active ? httpOptions.params.set('active', active.toString()) : '';
    await this._httpClient.get<SetsRO>(this._url, httpOptions).subscribe(
      setsRO => {
        this._sets.value.splice(0);
        setsRO.sets.forEach((set: SetEntity) => {
          const newSet: SetEntity = this._setFactory.createSet(set);
          this._sets.value.push(newSet);
        });
        this.updateSets();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  async create(set: SetEntity) {

    const setCreateDto: SetCreateDto = new SetCreateDto();
    setCreateDto.code = set.code;
    setCreateDto.name = set.name;
    setCreateDto.setTypeName = set.setType.name;
    setCreateDto.description = set.description;

    const httpOptions = this._authService.getHttpOptions(false);
    await this._httpClient.post<SetRO>(this._url, setCreateDto, httpOptions).subscribe(
      setRO => {
        const newSet: SetEntity = this._setFactory.createSet(setRO.set);
        this._sets.value.push(newSet);
        this.updateSets();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    )
  }

  async update(set: SetEntity) {

    const setUpdateDto: SetUpdateDto = new SetUpdateDto();
    setUpdateDto.id = set.id;
    setUpdateDto.code = set.code;
    setUpdateDto.name = set.name;
    setUpdateDto.setTypeName = set.setType.name;
    setUpdateDto.description = set.description;

    const httpOptions = this._authService.getHttpOptions(false);
    await this._httpClient.put<SetRO>(this._url, setUpdateDto, httpOptions).subscribe(
      setRO => {
        this._setFactory.copy(set, setRO.set);
        this._sets.value.push(setRO.set);
        this.updateSets();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    )
  }

  remove(set: SetEntity) {
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.delete<boolean>(this._url + `/${set.id}`, httpOptions).subscribe(
      res => {
        if (res) {
          set.active = 0;
          this.updateSets();
        }
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  active(set: SetEntity) {
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.patch<boolean>(this._url + `/${set.id}`, httpOptions).subscribe(
      res => {
        if (res) {
          set.active = 1;
          this.updateSets();
        }
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  // ==================================================
  // API FUNCTIONS - SET-TYPE
  // ==================================================
  findAllTypes(): Observable<SetTypeEntity[]> {
    const httpOptions = this._authService.getHttpOptions(false);
    return this._httpClient.get<SetTypeEntity[]>(this._url, httpOptions);
  }


  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================
  getOne(id: number): SetEntity {
    return this._sets.value.filter(set => set.id === id)[0];
  }

}