import { SectorEntity } from '../../wrap/sector/sector.entity';
import { SetEntity } from '../../wrap/set/set.entity';
import { StationEntity } from '../../wrap/station/station.entity';
import { UnitTypeTableEnum } from './../../../shared/constants/unit-type-table.enum';

export class UnitEntity {
  constructor() {
    this.active = 1;
  }

  // API properties
  id: number;
  code: string;
  unitTypeTable: UnitTypeTableEnum;
  altitude: number;
  latitude: number;
  longitude: number;
  station: StationEntity;
  sector: SectorEntity;
  sets: SetEntity[];
  description: string;
  active: number;
  created: Date;
  updated: Date;
  image: string;

  // MQTT Properties
  communication: number;
  received: number;
}
