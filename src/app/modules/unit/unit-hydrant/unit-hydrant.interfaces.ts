import { UnitHydrantEntity } from './unit-hydrant.entity';

export interface UnitHydrantRO {
  unitHydrant: UnitHydrantEntity;
}

export interface UnitsHydrantsRO {
  unitsHydrants: UnitHydrantEntity[];
  count: number;
}
