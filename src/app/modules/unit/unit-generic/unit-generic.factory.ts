import { Injectable } from '@angular/core';
import { UnitFactory } from '../unit/unit.factory';
import { UnitGenericCreateDto } from './dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from './dto/unit-generic-update.dto';
import { UnitGenericEntity } from './unit-generic.entity';

@Injectable({
    providedIn: 'root',
})
export class UnitGenericFactory {

    constructor(
        private readonly _unitFactory: UnitFactory,
    ) { }

    createUnitGeneric(unitGeneric: UnitGenericEntity): UnitGenericEntity {
        const newUnitGeneric: UnitGenericEntity = new UnitGenericEntity();
        if (unitGeneric) {
            newUnitGeneric.id = unitGeneric.id;
            newUnitGeneric.data1 = unitGeneric.data1;
            newUnitGeneric.data2 = unitGeneric.data2;
            newUnitGeneric.data3 = unitGeneric.data3;
            newUnitGeneric.data4 = unitGeneric.data4;
            newUnitGeneric.data5 = unitGeneric.data5;
            newUnitGeneric.unit = this._unitFactory.createUnit(unitGeneric.unit);
        }
        return newUnitGeneric;
    }

    copyUnitGeneric(target: UnitGenericEntity, source: UnitGenericEntity) {
        target.data1 = source.data1;
        target.data2 = source.data2;
        target.data3 = source.data3;
        target.data4 = source.data4;
        target.data5 = source.data5;
        target.unit = this._unitFactory.createUnit(source.unit);

    }

    getUnitGenericCreateDto(unitGeneric: UnitGenericEntity): UnitGenericCreateDto {
        const unitGenericCreateDto: UnitGenericCreateDto = new UnitGenericCreateDto();
        unitGenericCreateDto.data1 = unitGeneric.data1;
        unitGenericCreateDto.data2 = unitGeneric.data2;
        unitGenericCreateDto.data3 = unitGeneric.data3;
        unitGenericCreateDto.data4 = unitGeneric.data4;
        unitGenericCreateDto.data5 = unitGeneric.data5;
        unitGenericCreateDto.unit = this._unitFactory.getUnitCreateDto(unitGeneric.unit);
        return unitGenericCreateDto;
    }

    getUnitGenericUpdateDto(unitGeneric: UnitGenericEntity): UnitGenericUpdateDto {
        const unitGenericUpdateDto: UnitGenericUpdateDto = new UnitGenericUpdateDto();
        unitGenericUpdateDto.id = unitGeneric.id;
        unitGenericUpdateDto.data1 = unitGeneric.data1;
        unitGenericUpdateDto.data2 = unitGeneric.data2;
        unitGenericUpdateDto.data3 = unitGeneric.data3;
        unitGenericUpdateDto.data4 = unitGeneric.data4;
        unitGenericUpdateDto.data5 = unitGeneric.data5;
        unitGenericUpdateDto.unit = this._unitFactory.getUnitUpdateDto(unitGeneric.unit);
        return unitGenericUpdateDto;
    }

}