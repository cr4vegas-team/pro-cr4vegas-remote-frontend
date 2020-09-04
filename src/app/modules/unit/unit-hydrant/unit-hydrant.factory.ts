import { Injectable } from '@angular/core';
import { UnitFactory } from '../unit/unit.factory';
import { UnitHydrantCreateDto } from './dto/unit-hydrant-create.dto';
import { UnitHydrantUpdateDto } from './dto/unit-hydrant-update.dto';
import { UnitHydrantEntity } from './unit-hydrant.entity';

@Injectable({
    providedIn: 'root',
})
export class UnitHydrantFactory {

    constructor(
        private readonly _unitFactory: UnitFactory,
    ) { }
    createUnitHydrant(unitHydrant: UnitHydrantEntity): UnitHydrantEntity {
        const newUnitHydrant: UnitHydrantEntity = new UnitHydrantEntity();
        if (unitHydrant) {
            newUnitHydrant.id = unitHydrant.id;
            newUnitHydrant.filter = unitHydrant.filter;
            newUnitHydrant.diameter = unitHydrant.diameter;
            newUnitHydrant.unit = unitHydrant.unit;
        }
        return newUnitHydrant;
    }

    copyUnitHydrant(target: UnitHydrantEntity, source: UnitHydrantEntity) {
        target.filter = source.filter;
        target.diameter = source.diameter;
        target.unit = source.unit;
    }

    getUnitHydrantCreateDto(unitHydrant: UnitHydrantEntity): UnitHydrantCreateDto {
        const unitHydrantCreateDto: UnitHydrantCreateDto = new UnitHydrantCreateDto();
        unitHydrantCreateDto.filter = unitHydrant.filter;
        unitHydrantCreateDto.diameter = unitHydrant.diameter;
        unitHydrantCreateDto.unit = this._unitFactory.getUnitCreateDto(unitHydrant.unit);
        return unitHydrantCreateDto;
    }

    getUnitHydrantUpdateDto(unitHydrant: UnitHydrantEntity): UnitHydrantUpdateDto {
        const unitHydrantUpdateDto: UnitHydrantUpdateDto = new UnitHydrantUpdateDto();
        unitHydrantUpdateDto.id = unitHydrant.id;
        unitHydrantUpdateDto.filter = unitHydrant.filter;
        unitHydrantUpdateDto.diameter = unitHydrant.diameter;
        unitHydrantUpdateDto.unit = this._unitFactory.getUnitUpdateDto(unitHydrant.unit);
        return unitHydrantUpdateDto;
    }

}