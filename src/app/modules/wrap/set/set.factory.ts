

import { Injectable } from '@angular/core';
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
            set.units = source.units;
            set.created = source.created;
            set.updated = source.updated;
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
        target.units = source.units;
        target.created = source.created;
        target.updated = source.updated;
    }

}