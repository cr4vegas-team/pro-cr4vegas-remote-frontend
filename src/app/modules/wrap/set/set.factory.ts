import { SetWSDto } from './dto/set-ws.dto';
import { Injectable } from '@angular/core';
import { SetCreateDto } from './dto/set-create.dto';
import { SetUpdateDto } from './dto/set-update.dto';
import { SetEntity } from './set.entity';

@Injectable({
  providedIn: 'root',
})
export class SetFactory {
  // ==================================================
  //  FACTORY FUNCTIONS
  // ==================================================
  public createSet(source: any): SetEntity {
    const set: SetEntity = new SetEntity();
    if (source) {
      set.id = source.id;
      set.code = source.code;
      set.name = source.name;
      set.setType = source.setType;
      set.description = source.description;
      set.active = source.active;
      set.created = source.created;
      set.updated = source.updated;
      set.units = source.units;
      set.image = source.image;
    }
    return set;
  }

  public updateSet(target: SetEntity, source: SetEntity): void {
    target.id = source.id;
    target.code = source.code;
    target.name = source.name;
    target.setType = source.setType;
    target.description = source.description;
    target.active = source.active;
    target.created = source.created;
    target.updated = source.updated;
    target.units = source.units;
    target.image = source.image;
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  public getSetCreateDto(set: any): SetCreateDto {
    const setCreateDto: SetCreateDto = new SetCreateDto();
    setCreateDto.code = set.code;
    setCreateDto.name = set.name;
    setCreateDto.description = set.description;
    setCreateDto.setType = set.setType.name;
    setCreateDto.units = set.units ? set.units.map((unit) => unit.id) : [];
    setCreateDto.active = set.active;
    setCreateDto.image = set.image;
    return setCreateDto;
  }

  public getSetUpdateDto(set: any): SetUpdateDto {
    const setUpdateDto: SetUpdateDto = new SetUpdateDto();
    setUpdateDto.id = set.id;
    setUpdateDto.code = set.code;
    setUpdateDto.name = set.name;
    setUpdateDto.description = set.description;
    setUpdateDto.setType = set.setType.name;
    setUpdateDto.units = set.units ? set.units.map((unit) => unit.id) : [];
    setUpdateDto.active = set.active;
    setUpdateDto.image = set.image;
    return setUpdateDto;
  }

  public getSetWSDto(set: any): SetWSDto {
    const setWSDto: SetWSDto = new SetWSDto();
    setWSDto.id = set.id;
    setWSDto.code = set.code;
    setWSDto.name = set.name;
    setWSDto.description = set.description;
    setWSDto.setType = set.setType.name;
    setWSDto.units = set.units ? set.units : [];
    setWSDto.active = set.active;
    setWSDto.image = set.image;
    return setWSDto;
  }
}
