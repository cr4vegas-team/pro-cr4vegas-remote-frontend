import { Marker } from 'mapbox-gl';
import { UnitEntity } from './unit.entity';


export class StationEntity {

    // API properties
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
    active: boolean;

    // FrontEndProperties
    marker: Marker;
    markerSecondary: Marker;
    colour: string;

}