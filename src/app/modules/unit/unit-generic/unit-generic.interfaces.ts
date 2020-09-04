import { UnitGenericEntity } from './unit-generic.entity';

export interface UnitGenericRo {
    unitGeneric: UnitGenericEntity;
}

export interface UnitsGenericsRO {
    unitsGenerics: UnitGenericEntity[];
    count: number;
}