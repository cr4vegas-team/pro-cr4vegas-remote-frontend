import { Marker } from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { UnitEntity } from './unit.entity';
import { BouyState } from '../constants/bouy-state.enum';


export class UnitHydrantEntity {

    constructor() {}

    // API properties
    code: string;
    unit: UnitEntity;
    diameter: number;
    filter: number;
    colour: string;

    // FrontEnd properties
    subscription: Subscription;
    marker: Marker;
    img: string;

    // MQTT properties
    valve: boolean;
    flow: number;
    temperature: number;
    humidity: number;
    bouyLow: boolean;
    bouyMedium: boolean;
    bouyHight: boolean;
    bouyState: BouyState;
    bouyWarning: string;

}