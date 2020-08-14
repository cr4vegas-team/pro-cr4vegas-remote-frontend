import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SetEntity } from '../../models/set.entity';

@Injectable({
  providedIn: 'root'
})
export class SetService {

  private _sets: BehaviorSubject<SetEntity[]>;

  constructor() { 
    this._sets = new BehaviorSubject(Array<SetEntity>());
  }

  subscribeToSets(): Observable<SetEntity[]> {
    return this._sets;
  }
}
