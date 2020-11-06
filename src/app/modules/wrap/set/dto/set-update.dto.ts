import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';

export class SetUpdateDto {
  id: number;
  code: string;
  setType: string;
  name: string;
  description: string;
  units: number[];
  active: number;
  image: string;
}

export class SetTypeUpdateDto {
  oldName: string;
  newName: string;
}
