import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth/auth.service';
import { GLOBAL } from '../../../shared/constants/global.constant';
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
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
  ) {}

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  public findAll(): Observable<SectorsRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<SectorsRO>(this._url, httpOptions);
  }

  public create(sectorCreateDto: SectorCreateDto): Observable<SectorRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<SectorRO>(
      this._url,
      sectorCreateDto,
      httpOptions
    );
  }

  public update(sectorUpdateDto: SectorUpdateDto): Observable<SectorRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<SectorRO>(
      this._url,
      sectorUpdateDto,
      httpOptions
    );
  }

}
