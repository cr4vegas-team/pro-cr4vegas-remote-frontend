import { UnitEntity } from '../../unit/unit/unit.entity';
import { SessionEntity } from './../session/session.entity';

export class ActionEntity {
  id: number;
  session: SessionEntity;
  unit: UnitEntity;
  action: string;
  created: Date;
}
