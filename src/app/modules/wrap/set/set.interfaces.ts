
import { SetEntity } from './set.entity';

export interface SetRO {
    set: SetEntity;
}

// ==================================================
export interface SetsRO {
    sets: SetEntity[];
    count: number;
}
