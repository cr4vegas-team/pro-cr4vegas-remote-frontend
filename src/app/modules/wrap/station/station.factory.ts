

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

    copyWithNewMarker(target: StationEntity, source: any) {
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

}