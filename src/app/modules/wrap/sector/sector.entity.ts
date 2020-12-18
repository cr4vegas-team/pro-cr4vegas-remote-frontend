import { UnitEntity } from '../../unit/unit/unit.entity';

export class SectorEntity {
  constructor() {}
  // ==================================================
  //  API PROPERTIES
  // ==================================================
  id: number;
  units: UnitEntity[];
  code: string;
  name: string;
  description: string;
  updated: Date;
  created: Date;
  active: number;
  image: string;
}
