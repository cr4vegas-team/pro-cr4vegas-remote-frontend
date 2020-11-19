import { SetEntity } from './../../../wrap/set/set.entity';
import { SectorEntity } from './../../../wrap/sector/sector.entity';
import { StationEntity } from './../../../wrap/station/station.entity';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
export class UnitWSDto {
  id: number;
  code: number;
  unitTypeTable: UnitTypeTableEnum;
  station?: StationEntity;
  sector?: SectorEntity;
  sets?: SetEntity[];
  altitude: number;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  active: number;
}
