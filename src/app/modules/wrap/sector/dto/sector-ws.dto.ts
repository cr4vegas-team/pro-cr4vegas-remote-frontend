import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
export class SectorWSDto {
  id: number;
  code: string;
  name: string;
  description: string;
  active: number;
  units: UnitEntity[];
  image: string;
}
