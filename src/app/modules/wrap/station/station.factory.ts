import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { MapService } from './../../../shared/services/map.service';
import { StationCreateDto } from './dto/station-create.dto';
import { StationUpdateDto } from './dto/station-update.dto';
import { StationWSDto } from './dto/station-ws.dto';
import { StationEntity } from './station.entity';

@Injectable({
  providedIn: 'root',
})
export class StationFactory {
  private _map: Map;

  constructor(private readonly _mapService: MapService) {
    this._mapService.map.subscribe((map) => {
      if (map) {
        this._map = map;
      }
    });
  }

  // ==================================================
  //  FACTORY FUNCTIONS
  // ==================================================
  createStation(sourceStation: any): StationEntity {
    console.log(sourceStation);
    if (sourceStation) {
      const station: StationEntity = new StationEntity();
      station.id = sourceStation.id;
      station.code = sourceStation.code;
      station.altitude = sourceStation.altitude;
      station.longitude = sourceStation.longitude;
      station.latitude = sourceStation.latitude;
      station.active = sourceStation.active;
      station.updated = sourceStation.updated;
      station.created = sourceStation.created;
      station.description = sourceStation.description;
      station.name = sourceStation.name;
      station.units = sourceStation.units;
      station.image = sourceStation.image;
      this.createMarker(station);
      return station;
    }
    return null;
  }

  copyStation(target: StationEntity, source: any): void {
    target.id = source.id;
    target.code = source.code;
    target.altitude = source.altitude;
    target.longitude = source.longitude;
    target.latitude = source.latitude;
    target.active = source.active;
    target.updated = source.updated;
    target.created = source.created;
    target.description = source.description;
    target.name = source.name;
    target.units = source.units;
    target.image = source.image;
    this.createMarker(target);
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  public getStationCreateDto(station: any): StationCreateDto {
    const stationCreateDto: StationCreateDto = new StationCreateDto();
    stationCreateDto.code = station.code;
    stationCreateDto.name = station.name;
    stationCreateDto.description = station.description;
    stationCreateDto.altitude = station.altitude;
    stationCreateDto.longitude = station.longitude;
    stationCreateDto.latitude = station.latitude;
    stationCreateDto.active = station.active;
    stationCreateDto.units = station.units
      ? station.units.map((unit) => unit.id)
      : [];
    stationCreateDto.image = station.image;
    return stationCreateDto;
  }

  public getStationUpdateDto(station: any): StationUpdateDto {
    const stationUpdateDto: StationUpdateDto = new StationUpdateDto();
    stationUpdateDto.id = station.id;
    stationUpdateDto.code = station.code;
    stationUpdateDto.name = station.name;
    stationUpdateDto.description = station.description;
    stationUpdateDto.altitude = station.altitude;
    stationUpdateDto.longitude = station.longitude;
    stationUpdateDto.latitude = station.latitude;
    stationUpdateDto.active = station.active;
    stationUpdateDto.units = station.units
      ? station.units.map((unit) => unit.id)
      : [];
    stationUpdateDto.image = station.image;
    return stationUpdateDto;
  }

  public getStationWSDto(station: any): StationWSDto {
    const stationWSDto: StationWSDto = new StationWSDto();
    stationWSDto.id = station.id;
    stationWSDto.code = station.code;
    stationWSDto.name = station.name;
    stationWSDto.description = station.description;
    stationWSDto.altitude = station.altitude;
    stationWSDto.longitude = station.longitude;
    stationWSDto.latitude = station.latitude;
    stationWSDto.active = station.active;
    stationWSDto.units = station.units ? station.units : [];
    stationWSDto.image = station.image;
    return stationWSDto;
  }

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  private createMarker(station: StationEntity): void {
    if (station.marker) {
      station.marker.remove();
    }
    const divCode = document.createElement('div');
    divCode.style.padding = '3px';
    divCode.style.borderRadius = '10px';
    divCode.style.border = '1px solid black';
    divCode.style.backgroundColor = 'rgba(255,255,255,0.8)';
    divCode.style.display = 'flex';
    divCode.style.flexDirection = 'column';
    divCode.style.justifyContent = 'center';
    divCode.style.alignItems = 'center';
    divCode.onmouseover = () => {
      (divCode.children[0] as HTMLElement).style.display = 'block';
      divCode.style.width = '100px';
      divCode.style.height = '100px';
      divCode.style.zIndex = '2';
    };
    divCode.onmouseleave = () => {
      (divCode.children[0] as HTMLElement).style.display = 'none';
      divCode.style.width = 'min-content';
      divCode.style.height = 'min-content';
      divCode.style.zIndex = '1';
    };

    const title = document.createElement('div');
    title.innerHTML = `Estación<br><b>${station.name}</b>`;
    title.style.fontSize = '1em';
    title.style.textAlign = 'center';
    title.style.padding = '1px';
    title.style.borderRadius = '5px';
    title.style.display = 'none';

    const point = document.createElement('div');
    point.style.width = '2.0em';
    point.style.height = '2.0em';
    point.style.backgroundColor = this.getMarkerColour(station);
    point.style.margin = '1px auto';
    point.style.borderRadius = '2px';

    divCode.appendChild(title);
    divCode.appendChild(point);

    station.marker = new Marker(divCode, {}).setLngLat([
      station.longitude,
      station.latitude,
    ]);

    if (this._map) {
      station.marker.addTo(this._map);
    }
  }

  private getMarkerColour(station: StationEntity): string {
    if (station.active) {
      return MarkerColourEnum.STATION;
    }
    return MarkerColourEnum.INACTIVE;
  }
}
