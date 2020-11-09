import { IMqttMessage } from 'ngx-mqtt';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SetEntity } from '../../../modules/wrap/set/set.entity';
import { SetFactory } from '../../../modules/wrap/set/set.factory';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { SetCreateDto } from './dto/set-create.dto';
import { SetTypeUpdateDto, SetUpdateDto } from './dto/set-update.dto';
import { SetTypeEntity } from './set-type.entity';
import { SetRO, SetsRO } from './set.interfaces';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';

@Injectable({
  providedIn: 'root',
})
export class SetService implements OnDestroy {
  // ==================================================
  //  VARS CONSTANTS
  // ==================================================
  private _url: string = GLOBAL.API + 'set';
  // ==================================================
  //  VARS SUBJETS
  // ==================================================
  private _sets: BehaviorSubject<SetEntity[]>;
  // ==================================================
  //  VARS SUBSCRIPTIONS
  // ==================================================
  private _subServerUpdate: Subscription;
  private _subServerCreate: Subscription;

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _setFactory: SetFactory,
    private readonly _mqttEventService: MqttEventsService
  ) {
    this._sets = new BehaviorSubject<SetEntity[]>(Array<SetEntity>());
    this.subscribeToServerCreate();
    this.subscribeToServerUpdate();
  }

  // ==================================================
  //  LIFE CYCLE FUNCTIONS
  // ==================================================
  ngOnDestroy(): void {
    if (this._subServerCreate) {
      this._subServerCreate.unsubscribe();
    }
    if (this._subServerUpdate) {
      this._subServerUpdate.unsubscribe();
    }
  }

  // ==================================================
  //  SUBSCRIPTIONS FUNCTIONS
  // ==================================================
  private subscribeToServerCreate(): void {
    this._subServerCreate = this._mqttEventService
      .observe(TopicDestinationEnum.SERVER_DATA_CREATE, TopicTypeEnum.SET)
      .subscribe((data: IMqttMessage) => {
        const setJSON = JSON.parse(data.payload.toString());
        const foundedSets = this._sets.value.filter(
          (set) => set.id === setJSON.id
        );
        if (foundedSets.length === 0) {
          const newSet = this._setFactory.createSet(setJSON);
          this._sets.value.push(newSet);
          this.refresh();
        }
      });
  }

  private subscribeToServerUpdate(): void {
    this._subServerUpdate = this._mqttEventService
      .observe(TopicDestinationEnum.SERVER_DATA_UPDATE, TopicTypeEnum.SET)
      .subscribe((data: IMqttMessage) => {
        const setJSON = JSON.parse(data.payload.toString());
        const foundedSets = this._sets.value.filter(
          (set) => set.id === setJSON.id
        );
        if (foundedSets.length > 0) {
          const foundedSet = foundedSets[0];
          this._setFactory.updateSet(foundedSet, setJSON);
          this.refresh();
        }
      });
  }

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

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================
  public getSets(): BehaviorSubject<SetEntity[]> {
    return this._sets;
  }

  public refresh(): void {
    this._sets.next(this._sets.value);
  }

  public getOne(id: number): SetEntity {
    return this._sets.value.filter((set) => set.id === id)[0];
  }

  public cleanAll(): void {
    this._sets.value.splice(0);
  }

  public publishCreateOnMQTT(set: SetEntity): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_CREATE,
      TopicTypeEnum.SET,
      JSON.stringify(set)
    );
  }

  public publishUpdateOnMQTT(set: SetEntity): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_UPDATE,
      TopicTypeEnum.SET,
      JSON.stringify(set)
    );
  }
}
