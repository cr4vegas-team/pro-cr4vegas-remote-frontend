import { UnitEntity } from './../../../unit/unit/unit.entity';
export class SectorCreateDto {
  code: string;
  name: string;
  description: string;
  active: number;
  units: number[];
  image: string;
}
