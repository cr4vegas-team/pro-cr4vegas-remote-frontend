import { UnitTypeTableEnum } from './../../../../shared/constants/unit-type-table.enum';
export class UnitCreateDto {
  code: number;
  unitTypeTable: UnitTypeTableEnum;
  station?: number;
  sector?: number;
  sets?: number[];
  altitude: number;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  active: number;
}
