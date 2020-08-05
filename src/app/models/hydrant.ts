import { Marker } from 'mapbox-gl';
import { Subscription } from 'rxjs';


export class Hydrant {

    // Persistance DB
    code: string;
    sector: string;
    latitude: number;
    longitude: number;
    altitude: number;
    color: string;
    subscription: Subscription;
    marker: Marker;
    img: string;

    // Remote sensors
    valve: boolean;
    flow: number;
    temperature: number;
    humidity: number;
    bouyLow: boolean;
    bouyMedium: boolean;
    bouyHight: boolean;
    bouyState: string;
}