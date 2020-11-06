import { Injectable } from '@angular/core';
import { UnitCreateDto } from './dto/unit-create.dto';
import { UnitUpdateDto } from './dto/unit-update.dto';
import { UnitEntity } from './unit.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitFactory {
  createUnit(source: UnitEntity): UnitEntity {
    const unitEntity: UnitEntity = new UnitEntity();
    if (source) {
      unitEntity.id = source.id;
      unitEntity.code = source.code;
      unitEntity.altitude = source.altitude;
      unitEntity.longitude = source.longitude;
      unitEntity.latitude = source.latitude;
      unitEntity.unitTypeTable = source.unitTypeTable;
      unitEntity.sector = source.sector;
      unitEntity.station = source.station;
      unitEntity.sets = source.sets;
      unitEntity.active = source.active;
      unitEntity.created = source.created;
      unitEntity.updated = source.updated;
      unitEntity.description = source.description;
      unitEntity.image = source.image;
    }
    return unitEntity;
  }

  // ==================================================

  updateUnit(target: UnitEntity, source: any): UnitEntity {
    const unitEntity: UnitEntity = new UnitEntity();
    if (source) {
      target.id = source.id;
      target.code = source.code;
      target.altitude = source.altitude;
      target.longitude = source.longitude;
      target.latitude = source.latitude;
      target.unitTypeTable = source.unitTypeTable;
      target.sector = source.sector;
      target.station = source.station;
      target.sets = source.sets;
      target.active = source.active;
      target.created = source.created;
      target.updated = source.updated;
      target.description = source.description;
      target.image = source.image;
    }
    return unitEntity;
  }

  // ==================================================

  getUnitCreateDto(source: UnitEntity): UnitCreateDto {
    const unitCreateDto: UnitCreateDto = new UnitCreateDto();
    unitCreateDto.code = source.code;
    unitCreateDto.altitude = source.altitude;
    unitCreateDto.longitude = source.longitude;
    unitCreateDto.latitude = source.latitude;
    unitCreateDto.description = source.description;
    unitCreateDto.sector = source.sector ? source.sector.id : null;
    unitCreateDto.station = source.station ? source.station.id : null;
    unitCreateDto.sets = source.sets ? source.sets.map((set) => set.id) : [];
    unitCreateDto.image = source.image;
    unitCreateDto.active = source.active;
    return unitCreateDto;
  }

  // ==================================================

  getUnitUpdateDto(source: UnitEntity): UnitUpdateDto {
    const unitUpdateDto: UnitUpdateDto = new UnitUpdateDto();
    unitUpdateDto.id = source.id;
    unitUpdateDto.code = source.code;
    unitUpdateDto.altitude = source.altitude;
    unitUpdateDto.longitude = source.longitude;
    unitUpdateDto.latitude = source.latitude;
    unitUpdateDto.description = source.description;
    unitUpdateDto.sector = source.sector ? source.sector.id : NaN;
    unitUpdateDto.station = source.station ? source.station.id : NaN;
    unitUpdateDto.sets = source.sets ? source.sets.map((set) => set.id) : [];
    unitUpdateDto.image = source.image;
    unitUpdateDto.active = source.active;
    return unitUpdateDto;
  }
}
