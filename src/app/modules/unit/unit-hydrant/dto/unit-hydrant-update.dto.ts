import { UnitUpdateDto } from '../../unit/dto/unit-update.dto';

export class UnitHydrantUpdateDto {
  id: number;
  unit: UnitUpdateDto;
  initBatch: number;
  diameter: number;
  filter: number;
}
