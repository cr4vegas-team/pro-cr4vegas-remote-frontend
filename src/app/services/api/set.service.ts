import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from 'src/app/constants/global.constant';
import { SetEntity } from '../../models/set.entity';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SetService {

  private _url: string = GLOBAL.API + 'set';

  private _sets: BehaviorSubject<SetEntity[]>;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
  ) {
    this._sets = new BehaviorSubject<SetEntity[]>(Array<SetEntity>());
    this.getSets();
  }

  subscribeToSets(): Observable<any> {
    return this._sets.asObservable();
  }

  // ==================================================
  // REQUEST TO API
  // ==================================================
  getSets() {
    this._httpClient.get(this._url, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        (res as any).sets.forEach(set => {
          if (this._sets.value.indexOf(set) == -1) {
            this._sets.value.push(set);
          }
        });
        this._sets.next(this._sets.value);
      },
      err => {
        this._sets.error(err);
      }
    );
  }
}