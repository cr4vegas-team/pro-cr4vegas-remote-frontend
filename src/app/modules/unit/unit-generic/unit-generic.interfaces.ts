import { UnitGenericEntity } from './unit-generic.entity';

export interface UnitGenericRO {
  unitGeneric: UnitGenericEntity;
}

// ==================================================
export interface UnitsGenericsRO {
  unitsGenerics: UnitGenericEntity[];
  count: number;
}
