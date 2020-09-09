

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StationCreateDto } from './dto/station-create.dto';
import { StationUpdateDto } from './dto/station-update.dto';
import { StationEntity } from './station.entity';

@Injectable({
    providedIn: 'root',
})
export class StationFactory {

    constructor(
        private readonly _matDialog: MatDialog,
    ) { }

    createStation(sourceStation: StationEntity): StationEntity {
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
            return station;
        }
        return null;
    }

    copy(target: StationEntity, source: any) {
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
    }

    getStationCreateDto(station: StationEntity): StationCreateDto {
        const stationCreateDto: StationCreateDto = new StationCreateDto();
        stationCreateDto.code = station.code;
        stationCreateDto.name = station.name;
        stationCreateDto.description = station.description;
        stationCreateDto.altitude = station.altitude;
        stationCreateDto.longitude = station.longitude;
        stationCreateDto.latitude = station.latitude;
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
        return stationUpdateDto;
    }

}