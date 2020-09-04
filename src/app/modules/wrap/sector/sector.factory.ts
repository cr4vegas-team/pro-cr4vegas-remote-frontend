

import { Injectable } from '@angular/core';
import { SectorEntity } from './sector.entity';

@Injectable({
    providedIn: 'root',
})
export class SectorFactory {

    constructor() { }

    createSector(source?: any): SectorEntity {
        const sector: SectorEntity = new SectorEntity();
        if (source) {
            sector.id = source.id;
            sector.code = source.code;
            sector.name = source.name;
            sector.active = source.active;
            sector.description = source.description;
            sector.units = source.units;
            sector.created = source.created;
            sector.updated = source.updated;
        }
        return sector;
    }

    copy(target: SectorEntity, source: SectorEntity) {
        target.id = source.id;
        target.code = source.code;
        target.name = source.name;
        target.active = source.active;
        target.description = source.description;
        target.units = source.units;
        target.created = source.created;
        target.updated = source.updated;
    }

}