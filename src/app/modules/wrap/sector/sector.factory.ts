

import { Injectable } from '@angular/core';
import { SectorCreateDto } from './dto/sector-create.dto';
import { SectorUpdateDto } from './dto/sector-update.dto';
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

    getSectorCreateDto(sector: SectorEntity): SectorCreateDto {
        const sectorCreateDto: SectorCreateDto = new SectorCreateDto();
        sectorCreateDto.code = sector.code;
        sectorCreateDto.name = sector.name;
        sectorCreateDto.description = sector.description;
        return sectorCreateDto;
    }

    getSectorUpdateDto(sector: SectorEntity): SectorUpdateDto {
        const sectorUpdateDto: SectorUpdateDto = new SectorUpdateDto();
        sectorUpdateDto.id = sector.id;
        sectorUpdateDto.code = sector.code;
        sectorUpdateDto.name = sector.name;
        sectorUpdateDto.description = sector.description;
        return sectorUpdateDto;
    }

}