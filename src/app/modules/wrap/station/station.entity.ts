import { Marker } from 'mapbox-gl';
import { UnitEntity } from '../../unit/unit/unit.entity';

export class StationEntity {
  constructor() {
    this.active = 1;
  }

  // ==================================================
  // API PROPERTIES
  // ==================================================
  id: number;
  units: UnitEntity[];
  code: string;
  name: string;
  altitude: number;
  latitude: number;
  longitude: number;
  description: string;
  updated: Date;
  created: Date;
  active: number;
  image: string;

  // ==================================================
  // FRONTEND PROPERTIES
  // ==================================================
  public marker: Marker;
}
