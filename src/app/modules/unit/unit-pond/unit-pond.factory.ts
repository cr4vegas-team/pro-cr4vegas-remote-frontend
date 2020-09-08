import { Injectable } from '@angular/core';
import { UnitFactory } from '../unit/unit.factory';
import { UnitPondCreateDto } from './dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from './dto/unit-pond-update.dto';
import { UnitPondEntity } from './unit-pond.entity';

@Injectable({
    providedIn: 'root',
})
export class UnitPondFactory {

    constructor(
        private readonly _unitFactory: UnitFactory,
    ) { }

    createUnitPond(unitPond: UnitPondEntity): UnitPondEntity {
        const newUnitPond: UnitPondEntity = new UnitPondEntity();
        if (unitPond) {
            newUnitPond.id = unitPond.id;
            newUnitPond.m3 = unitPond.m3;
            newUnitPond.height = unitPond.height;
            newUnitPond.unit = this._unitFactory.createUnit(unitPond.unit);
        }
        return newUnitPond;
    }

    copyUnitPond(target: UnitPondEntity, source: UnitPondEntity) {
        target.m3 = source.m3;
        target.height = source.height;
        target.unit = this._unitFactory.createUnit(source.unit)
    }

    getUnitPondCreateDto(unitPond: UnitPondEntity): UnitPondCreateDto {
        const unitPondCreateDto: UnitPondCreateDto = new UnitPondCreateDto();
        unitPondCreateDto.m3 = unitPond.m3;
        unitPondCreateDto.height = unitPond.height;
        unitPondCreateDto.unit = this._unitFactory.getUnitCreateDto(unitPond.unit);
        return unitPondCreateDto;
    }

    getUnitPondUpdateDto(unitPond: UnitPondEntity): UnitPondUpdateDto {
        const unitPondUpdateDto: UnitPondUpdateDto = new UnitPondUpdateDto();
        unitPondUpdateDto.id = unitPond.id;
        unitPondUpdateDto.m3 = unitPond.m3;
        unitPondUpdateDto.height = unitPond.height;
        unitPondUpdateDto.unit = this._unitFactory.getUnitUpdateDto(unitPond.unit);
        return unitPondUpdateDto;
    }

}