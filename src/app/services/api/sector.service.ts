import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SectorEntity } from '../../models/sector.entity';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private _sectors: BehaviorSubject<SectorEntity[]>;

  constructor() {
    this._sectors = new BehaviorSubject(Array<SectorEntity>());
  }

  subscribeToSectors(): Observable<SectorEntity[]> {
    return this._sectors;
  }
}
