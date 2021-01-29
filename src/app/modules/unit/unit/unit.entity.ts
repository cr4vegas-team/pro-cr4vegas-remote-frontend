import { SectorEntity } from '../../wrap/sector/sector.entity';
import { SetEntity } from '../../wrap/set/set.entity';
import { UnitTypeTableEnum } from './../../../shared/constants/unit-type-table.enum';

export class UnitEntity {
  constructor() {
    this.active = 1;
  }

  // ==================================================
  //  API PROPERTIES
  // ==================================================
  id: number;
  code: number;
  unitTypeTable: UnitTypeTableEnum;
  altitude: number;
  latitude: number;
  longitude: number;
  sector: SectorEntity;
  sets: SetEntity[];
  description: string;
  active: number;
  created: Date;
  updated: Date;
  image: string;
  name: string;

  // ==================================================
  //  MQTT PROPERTIES
  // ==================================================
  communication: number;
  received: number;
  operator: string;
  signal: number;
  ip: string;
}
