

import { Injectable } from '@angular/core';
import { SetCreateDto } from './dto/set-create.dto';
import { SetUpdateDto } from './dto/set-update.dto';
import { SetEntity } from './set.entity';

@Injectable({
    providedIn: 'root',
})
export class SetFactory {

    constructor() { }

    createSet(source?: any): SetEntity {
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
        }
        return set;
    }

    copy(target: SetEntity, source: SetEntity) {
        target.id = source.id;
        target.code = source.code;
        target.name = source.name;
        target.setType = source.setType;
        target.description = source.description;
        target.active = source.active;
        target.created = source.created;
        target.updated = source.updated;
        target.units = source.units;
    }

    getSetCreateDto(set: SetEntity): SetCreateDto {
        const setCreateDto: SetCreateDto = new SetCreateDto();
        setCreateDto.code = set.code;
        setCreateDto.name = set.name;
        setCreateDto.description = set.description;
        setCreateDto.setType = set.setType.name;
        setCreateDto.units = set.units;
        return setCreateDto;
    }

    getSetUpdateDto(set: SetEntity): SetUpdateDto {
        const setUpdateDto: SetUpdateDto = new SetUpdateDto();
        setUpdateDto.id = set.id;
        setUpdateDto.code = set.code;
        setUpdateDto.name = set.name;
        setUpdateDto.description = set.description;
        setUpdateDto.setType = set.setType.name;
        setUpdateDto.units = set.units;
        return setUpdateDto;
    }

}
