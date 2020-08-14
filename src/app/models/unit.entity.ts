import { Marker } from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { StationEntity } from './station.entity';
import { SectorEntity } from './sector.entity';
import { SetEntity } from './set.entity';
import { UnitTypeEnum } from '../constants/unit-type.enum';

export class UnitEntity {

    // API properties
    id: number;
    unitType: UnitTypeEnum;
    altitude: number;
    latitude: number;
    longitude: number;
    station: StationEntity;
    sector: SectorEntity;
    sets: SetEntity[];
    description: string;
    active: number;
    created: Date;
    updated: Date;

    // FrontEnd properties
    subscription: Subscription;
    marker: Marker;

    // MQTT properties
    // Add properties dynamically
    
}