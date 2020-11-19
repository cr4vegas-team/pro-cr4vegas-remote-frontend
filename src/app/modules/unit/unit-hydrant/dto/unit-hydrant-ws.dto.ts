import { UnitWSDto } from './../../unit/dto/unit-ws.dto';

export class UnitHydrantWSDto {
  id: number;
  unit: UnitWSDto;
  diameter: number;
  filter: number;
}
