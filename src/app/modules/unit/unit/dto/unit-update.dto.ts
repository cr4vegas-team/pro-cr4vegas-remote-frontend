import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';

export class UnitUpdateDto {
  id: number;
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
  name: string;
}
