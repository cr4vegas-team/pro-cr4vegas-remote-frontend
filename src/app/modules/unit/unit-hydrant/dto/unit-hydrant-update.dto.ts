import { UnitUpdateDto } from '../../unit/dto/unit-update.dto';

export class UnitHydrantUpdateDto {
  id: number;
  unit: UnitUpdateDto;
  diameter: number;
  filter: number;
}
