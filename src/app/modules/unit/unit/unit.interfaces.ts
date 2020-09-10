import { UnitEntity } from './unit.entity';


export interface UnitRO {
    unit: UnitEntity;
}

export interface UnitsRO {
    units: UnitEntity[];
    count: number;
}