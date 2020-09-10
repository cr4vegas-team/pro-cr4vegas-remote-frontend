import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SectorFactory } from '../../../modules/wrap/sector/sector.factory';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { SectorEntity } from '../sector/sector.entity';
import { SectorCreateDto } from './dto/sector-create.dto';
import { SectorUpdateDto } from './dto/sector-update.dto';
import { SectorRO, SectorsRO } from './sector.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private _url: string = GLOBAL.API + 'sector';

  private _sectors: BehaviorSubject<SectorEntity[]>;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _sectorFactory: SectorFactory,
    private readonly _authService: AuthService,
  ) {
    this._sectors = new BehaviorSubject<SectorEntity[]>(Array<SectorEntity>());
  }

  public get sectors(): BehaviorSubject<SectorEntity[]> {
    return this._sectors;
  }

  updateSectors() {
    this._sectors.next(this._sectors.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  async findAll() {
    const httpOptions = this._authService.getHttpOptions({});
    await this._httpClient.get<SectorsRO>(this._url, httpOptions).subscribe(
      sectorsRO => {
        this._sectors.value.splice(0);
        sectorsRO.sectors.forEach((sector: SectorEntity) => {
          const newSector: SectorEntity = this._sectorFactory.createSector(sector);
          this._sectors.value.push(newSector);
        });
        this.updateSectors();
      },
      error => {
        throw new Error(error);
      }
    );
  }

  create(sectorCreateDto: SectorCreateDto): Observable<SectorRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<SectorRO>(this._url, sectorCreateDto, httpOptions);
  }

  update(sectorUpdateDto: SectorUpdateDto): Observable<SectorRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<SectorRO>(this._url, sectorUpdateDto, httpOptions);
  }

  remove(sector: SectorEntity): Observable<boolean> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.delete<boolean>(this._url + `/${sector.id}`, httpOptions);
  }

  active(sector: SectorEntity): Observable<boolean> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.patch<boolean>(this._url + `/${sector.id}`, httpOptions);
  }

  // ==================================================
  // FRONT FUNCTIOSN
  // ==================================================
  getOne(id: number): SectorEntity {
    return this._sectors.value.filter(sector => sector.id === id)[0];
  }

}
