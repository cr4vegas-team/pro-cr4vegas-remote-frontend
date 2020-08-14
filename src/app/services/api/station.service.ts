import { Injectable } from '@angular/core';
import { StationEntity } from '../../models/station.entity';
import { HttpClient } from '@angular/common/http';
import { GLOBAL } from '../../constants/global.constant';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StationService {

  private _url: string = GLOBAL.API + 'station';

  private _stations: BehaviorSubject<StationEntity[]>;
  private _stations$: Observable<StationEntity[]>;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
  ) {
    this._stations = new BehaviorSubject<StationEntity[]>(Array<StationEntity>());
    this._stations$ = this._stations.asObservable();
    this.getStations();
  }

  subscribeToStatiosn(): Observable<any> {
    return this._stations$;
  }

  // ==================================================
  // REQUEST TO API
  // ==================================================
  getStations() {
    this._httpClient.get(this._url, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        (res as any).stations.forEach(unitHydrant => {
          if (this._stations.value.indexOf(unitHydrant) == -1) {
            this._stations.value.push(unitHydrant);
          }
        });
        this._stations.next(this._stations.value);
      },
      err => {
        this._stations.error(err);
      }
    );
  }
}
