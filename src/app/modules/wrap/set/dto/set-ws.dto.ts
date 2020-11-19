import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
export class SetWSDto {
  id: number;
  code: string;
  setType: string;
  name: string;
  description: string;
  units: UnitEntity[];
  active: number;
  image: string;
}
