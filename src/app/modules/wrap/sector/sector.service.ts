import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth/auth.service';
import { SectorFactory } from '../../../modules/wrap/sector/sector.factory';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { SectorEntity } from '../sector/sector.entity';
import { SectorCreateDto } from './dto/sector-create.dto';
import { SectorUpdateDto } from './dto/sector-update.dto';
import { SectorRO, SectorsRO } from './sector.interfaces';

@Injectable({
  providedIn: 'root',
})
export class SectorService {
  // ==================================================
  //  VARS CONSTANT
  // ==================================================
  private _url: string = GLOBAL.API + 'sector';
  // ==================================================
  //  VARS SUBJECTS
  // ==================================================
  private _sectors: BehaviorSubject<SectorEntity[]>;

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _sectorFactory: SectorFactory,
    private readonly _authService: AuthService
  ) {
    this._sectors = new BehaviorSubject<SectorEntity[]>(Array<SectorEntity>());
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  public findAll(): void {
    const httpOptions = this._authService.getHttpOptions({});
    this._httpClient.get<SectorsRO>(this._url, httpOptions).subscribe(
      (sectorsRO) => {
        this.cleanAll();
        const sectorsFounded: SectorEntity[] = [];
        sectorsRO.sectors.forEach((sector: SectorEntity) => {
          const newSector: SectorEntity = this._sectorFactory.createSector(
            sector
          );
          sectorsFounded.push(newSector);
        });
        this._sectors.next(sectorsFounded);
      }
    );
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
    this._sectors.next([]);
  }

  // ==================================================
  //  WS FUNCTIONS
  // ==================================================
  public updateWS(sector: any): void {
    const sectorFound = this._sectors.value.filter(
      (station) => (station.id = sector.id)
    )[0];
    if (sectorFound) {
      this._sectorFactory.copySector(sectorFound, sector);
      this.refresh();
    }
  }

  public createWS(sector: any): void {
    this._sectors.value.push(sector);
    this.refresh();
  }
}
