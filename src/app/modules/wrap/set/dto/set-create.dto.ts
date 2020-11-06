import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';

export class SetCreateDto {
  code: string;
  setType: string;
  name: string;
  description: string;
  units: number[];
  active: number;
  image: string;
}
