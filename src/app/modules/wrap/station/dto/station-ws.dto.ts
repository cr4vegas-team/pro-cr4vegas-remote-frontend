import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
export class StationWSDto {
  id: number;
  code: string;
  name: string;
  description: string;
  altitude: number;
  latitude: number;
  longitude: number;
  active: number;
  units: UnitEntity[];
  image: string;
}
