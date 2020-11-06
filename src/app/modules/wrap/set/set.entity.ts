import { UnitEntity } from '../../unit/unit/unit.entity';
import { SetTypeEntity } from './set-type.entity';

export class SetEntity {
  // ==================================================
  // API PROPERTIES
  // ==================================================
  id: number;
  setType: SetTypeEntity;
  code: string;
  name: string;
  description: string;
  updated: Date;
  created: Date;
  active: number;
  units: UnitEntity[];
  image: string;
}
