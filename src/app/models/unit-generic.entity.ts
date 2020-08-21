import { Marker } from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { UnitEntity } from '../models/unit.entity';

export interface Property {
    name: string,
    value: any,
}
export class UnitGenericEntity {

    // API properties
    code: string;
    unit: UnitEntity;
    properties: Property[];

    // FrontEnd properties
    marker: Marker;
    subscription: Subscription;

}