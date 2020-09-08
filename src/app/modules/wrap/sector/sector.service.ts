import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { SectorFactory } from '../../../modules/wrap/sector/sector.factory';
import { AuthService } from '../../../shared/services/auth.service';
import { SectorEntity } from '../sector/sector.entity';
import { SectorCreateDto } from './dto/sector-create.dto';
import { SectorUpdateDto } from './dto/sector-update.dto';
import { SectorRO, SectorsRO } from './sector.interfaces';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private _url: string = GLOBAL.API + 'sector';

  private _sectors: BehaviorSubject<SectorEntity[]>;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _sectorFactory: SectorFactory,
    private readonly _dialogService: DialogService,
  ) {
    this._sectors = new BehaviorSubject<SectorEntity[]>(Array<SectorEntity>());

    this._authService.observeAuthenticated().subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.findAll();
        }
      }
    );
  }

  subscribeToSectors(): BehaviorSubject<SectorEntity[]> {
    return this._sectors;
  }

  updateSectors() {
    this._sectors.next(this._sectors.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  async findAll(active?: number) {
    const httpOptions = this._authService.getHttpOptions(active ? true : false);
    active ? httpOptions.params.set('active', active.toString()) : '';
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
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  async create(sector: SectorEntity) {

    const sectorCreateDto: SectorCreateDto = new SectorCreateDto();
    sectorCreateDto.code = sector.code;
    sectorCreateDto.name = sector.name;
    sectorCreateDto.description = sector.description;

    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.post<SectorRO>(this._url, sectorCreateDto, httpOptions).subscribe(
      sectorRO => {
        const newSector: SectorEntity = this._sectorFactory.createSector(sectorRO.sector);
        this._sectors.value.push(newSector);
        this.updateSectors();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    )
  }

  async update(sector: SectorEntity) {

    const sectorUpdateDto: SectorUpdateDto = new SectorUpdateDto();
    sectorUpdateDto.id = sector.id;
    sectorUpdateDto.code = sector.code;
    sectorUpdateDto.name = sector.name;
    sectorUpdateDto.description = sector.description;

    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.put<SectorRO>(this._url, sectorUpdateDto, httpOptions).subscribe(
      sectorRO => {
        this._sectorFactory.copy(sector, sectorRO.sector);
        this._sectors.value.push(sectorRO.sector);
        this.updateSectors();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    )
  }

  remove(sector: SectorEntity) {
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.delete<boolean>(this._url + `/${sector.id}`, httpOptions).subscribe(
      res => {
        if (res) {
          sector.active = 0;
          this.updateSectors();
        }
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  active(sector: SectorEntity) {
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.patch<boolean>(this._url + `/${sector.id}`, httpOptions).subscribe(
      res => {
        if (res) {
          sector.active = 1;
          this.updateSectors();
        }
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  // ==================================================
  // FRONT FUNCTIOSN
  // ==================================================
  getOne(id: number): SectorEntity {
    return this._sectors.value.filter(sector => sector.id === id)[0];
  }

}
