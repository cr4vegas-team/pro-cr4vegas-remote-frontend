import { MapService } from './../../../shared/services/map.service';
import { Injectable } from '@angular/core';
import { Marker, Map } from 'mapbox-gl';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { StationCreateDto } from './dto/station-create.dto';
import { StationUpdateDto } from './dto/station-update.dto';
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

  updateStation(target: StationEntity, source: any): void {
    target.id = source.id ? source.id : target.id;
    target.code = source.code ? source.code : target.code;
    target.altitude = source.altitude ? source.altitude : target.altitude;
    target.longitude = source.longitude ? source.longitude : target.longitude;
    target.latitude = source.latitude ? source.latitude : target.latitude;
    target.active = source.active ? source.active : target.active;
    target.updated = source.updated ? source.updated : target.updated;
    target.created = source.created ? source.created : target.created;
    target.description = source.description
      ? source.description
      : target.description;
    target.name = source.name ? source.name : target.name;
    target.units = source.units ? source.units : target.units;
    target.image = source.image ? source.image : target.image;
    this.createMarker(target);
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  getStationCreateDto(station: StationEntity): StationCreateDto {
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

  getStationUpdateDto(station: StationEntity): StationUpdateDto {
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

  public clean(station: StationEntity): void {
    if (station.marker) {
      station.marker.remove();
    }
  }

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  public createMarker(station: StationEntity): void {
    if (station.marker) {
      station.marker.remove();
    }
    station.marker = new Marker({
      color: this.getMarkerColour(station),
    }).setLngLat([station.longitude, station.latitude]);
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
