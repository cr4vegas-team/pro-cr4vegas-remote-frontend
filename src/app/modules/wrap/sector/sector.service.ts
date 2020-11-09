import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SectorFactory } from '../../../modules/wrap/sector/sector.factory';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { SectorEntity } from '../sector/sector.entity';
import { SectorCreateDto } from './dto/sector-create.dto';
import { SectorUpdateDto } from './dto/sector-update.dto';
import { SectorRO, SectorsRO } from './sector.interfaces';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { IMqttMessage } from 'ngx-mqtt';

@Injectable({
  providedIn: 'root',
})
export class SectorService implements OnDestroy {
  // ==================================================
  //  VARS CONSTANT
  // ==================================================
  private _url: string = GLOBAL.API + 'sector';
  // ==================================================
  //  VARS SUBJECTS
  // ==================================================
  private _sectors: BehaviorSubject<SectorEntity[]>;
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
    private readonly _sectorFactory: SectorFactory,
    private readonly _authService: AuthService,
    private readonly _mqttEventService: MqttEventsService
  ) {
    this._sectors = new BehaviorSubject<SectorEntity[]>(Array<SectorEntity>());
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
      .observe(TopicDestinationEnum.SERVER_DATA_CREATE, TopicTypeEnum.SECTOR)
      .subscribe((data: IMqttMessage) => {
        const sectorJSON = JSON.parse(data.payload.toString());
        const foundedSectors = this._sectors.value.filter(
          (set) => set.id === sectorJSON.id
        );
        if (foundedSectors.length === 0) {
          const newSector = this._sectorFactory.createSector(sectorJSON);
          this._sectors.value.push(newSector);
          this.refresh();
        }
      });
  }

  private subscribeToServerUpdate(): void {
    this._subServerUpdate = this._mqttEventService
      .observe(TopicDestinationEnum.SERVER_DATA_UPDATE, TopicTypeEnum.SECTOR)
      .subscribe((data: IMqttMessage) => {
        const sectorJSON = JSON.parse(data.payload.toString());
        const foundedSectors = this._sectors.value.filter(
          (set) => set.id === sectorJSON.id
        );
        if (foundedSectors.length > 0) {
          const foundedSector = foundedSectors[0];
          this._sectorFactory.updateSector(foundedSector, sectorJSON);
          this.refresh();
        }
      });
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  findAll(): Observable<SectorsRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<SectorsRO>(this._url, httpOptions);
  }

  create(sectorCreateDto: SectorCreateDto): Observable<SectorRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<SectorRO>(
      this._url,
      sectorCreateDto,
      httpOptions
    );
  }

  update(sectorUpdateDto: SectorUpdateDto): Observable<SectorRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<SectorRO>(
      this._url,
      sectorUpdateDto,
      httpOptions
    );
  }

  // ==================================================
  // FRONT FUNCTIOSN
  // ==================================================
  public getSectors(): BehaviorSubject<SectorEntity[]> {
    return this._sectors;
  }

  public refresh(): void {
    this._sectors.next(this._sectors.value);
  }

  public getOne(id: number): SectorEntity {
    return this._sectors.value.filter((sector) => sector.id === id)[0];
  }

  public cleanAll(): void {
    this._sectors.value.slice(0);
  }

  public publishCreateOnMQTT(sector: SectorEntity): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_CREATE,
      TopicTypeEnum.SECTOR,
      JSON.stringify(sector)
    );
  }

  public publishUpdateOnMQTT(sector: SectorEntity): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_UPDATE,
      TopicTypeEnum.SECTOR,
      JSON.stringify(sector)
    );
  }
}
