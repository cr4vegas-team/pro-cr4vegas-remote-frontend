import { Marker } from 'mapbox-gl';
import { UnitMap } from '../interfaces/unit-map.interface';

export class UnitGenericEntity implements UnitMap {

    code: string;
    name: string;
    colour: string;
    marker: Marker;
    markerSecondary: Marker;

}