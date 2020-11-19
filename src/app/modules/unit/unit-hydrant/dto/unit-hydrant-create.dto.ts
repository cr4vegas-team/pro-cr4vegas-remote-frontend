import { UnitCreateDto } from '../../unit/dto/unit-create.dto';

export class UnitHydrantCreateDto {
  unit: UnitCreateDto;
  diameter: number;
  filter: number;
}
