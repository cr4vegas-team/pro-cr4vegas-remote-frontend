import { Injectable } from '@angular/core';
import { UnitCreateDto } from './dto/unit-create.dto';
import { UnitUpdateDto } from './dto/unit-update.dto';
import { UnitWSDto } from './dto/unit-ws.dto';
import { UnitEntity } from './unit.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitFactory {
  // ==================================================
  //  FACTORY FUNCTIONS
  // ==================================================
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
      unitEntity.sets = source.sets;
      unitEntity.active = source.active;
      unitEntity.created = source.created;
      unitEntity.updated = source.updated;
      unitEntity.description = source.description;
      unitEntity.image = source.image;
      unitEntity.communication = 0;
      unitEntity.name = source.name;
    }
    return unitEntity;
  }

  updateUnit(target: UnitEntity, source: any): UnitEntity {
    if (source) {
      target.id = source.id;
      target.code = source.code;
      target.altitude = source.altitude;
      target.longitude = source.longitude;
      target.latitude = source.latitude;
      target.unitTypeTable = source.unitTypeTable;
      target.sector = source.sector;
      target.sets = source.sets;
      target.active = source.active;
      target.created = source.created;
      target.updated = source.updated;
      target.description = source.description;
      target.image = source.image;
      target.name = source.name;
    }
    return target;
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  getUnitCreateDto(source: any): UnitCreateDto {
    const unitCreateDto: UnitCreateDto = new UnitCreateDto();
    unitCreateDto.code = source.code;
    unitCreateDto.unitTypeTable = source.unitTypeTable;
    unitCreateDto.altitude = source.altitude;
    unitCreateDto.longitude = source.longitude;
    unitCreateDto.latitude = source.latitude;
    unitCreateDto.description = source.description;
    unitCreateDto.sector = source.sector ? source.sector.id : null;
    unitCreateDto.sets = source.sets ? source.sets.map((set) => set.id) : [];
    unitCreateDto.image = source.image;
    unitCreateDto.active = source.active;
    unitCreateDto.name = source.name;
    return unitCreateDto;
  }

  getUnitUpdateDto(source: any): UnitUpdateDto {
    const unitUpdateDto: UnitUpdateDto = new UnitUpdateDto();
    unitUpdateDto.id = source.id;
    unitUpdateDto.code = source.code;
    unitUpdateDto.unitTypeTable = source.unitTypeTable;
    unitUpdateDto.altitude = source.altitude;
    unitUpdateDto.longitude = source.longitude;
    unitUpdateDto.latitude = source.latitude;
    unitUpdateDto.description = source.description;
    unitUpdateDto.sector = source.sector ? source.sector.id : NaN;
    unitUpdateDto.sets = source.sets ? source.sets.map((set) => set.id) : [];
    unitUpdateDto.image = source.image;
    unitUpdateDto.active = source.active;
    unitUpdateDto.name = source.name;
    return unitUpdateDto;
  }

  getUnitWSDto(source: UnitEntity): UnitWSDto {
    const unitWSDto: UnitWSDto = new UnitWSDto();
    unitWSDto.id = source.id;
    unitWSDto.code = source.code;
    unitWSDto.unitTypeTable = source.unitTypeTable;
    unitWSDto.altitude = source.altitude;
    unitWSDto.longitude = source.longitude;
    unitWSDto.latitude = source.latitude;
    unitWSDto.description = source.description;
    unitWSDto.sector = source.sector ? source.sector : null;
    unitWSDto.sets = source.sets ? source.sets.map((set) => set) : [];
    unitWSDto.image = source.image;
    unitWSDto.active = source.active;
    unitWSDto.name = source.name;
    return unitWSDto;
  }
}
