import { UnitCreateDto } from '../../unit/dto/unit-create.dto';

export class UnitHydrantCreateDto {
  unit: UnitCreateDto;
  initBatch: number;
  diameter: number;
  filter: number;
}
