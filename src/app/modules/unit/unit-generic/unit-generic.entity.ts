import { Map, Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { Observable, Subscription } from 'rxjs';
import { MarkerColourEnum } from '../../../shared/constants/marker-colour.enum';
import { UnitEntity } from '../unit/unit.entity';


export class UnitGenericEntity {

    // ==================================================
    // API PROPERTIES
    // ==================================================

    private _id: number;
    private _unit: UnitEntity;
    private _data1: string;
    private _data2: string;
    private _data3: string;
    private _data4: string;
    private _data5: string;

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get unit(): UnitEntity {
        return this._unit;
    }

    public set unit(unit: UnitEntity) {
        this._unit = unit;
    }

    public get data1(): string {
        return this._data1;
    }

    public set data1(data1: string) {
        this._data1 = data1;
    }

    public get data2(): string {
        return this._data2;
    }

    public set data2(data2: string) {
        this._data2 = data2;
    }

    public get data3(): string {
        return this._data3;
    }

    public set data3(data3: string) {
        this._data3 = data3;
    }

    public get data4(): string {
        return this._data4;
    }

    public set data4(data4: string) {
        this._data4 = data4;
    }

    public get data5(): string {
        return this._data5;
    }

    public set data5(data5: string) {
        this._data5 = data5;
    }

    // ==================================================
    // MQTT PROPERTIES
    // ==================================================

    private _property1: string;
    private _property2: string;
    private _property3: string;
    private _property4: string;
    private _property5: string;

    public get property1(): string {
        return this._property1;
    }

    public set property1(property1: string) {
        this._property1 = property1;
    }

    public get property2(): string {
        return this._property2;
    }

    public set property2(property2: string) {
        this._property2 = property2;
    }

    public get property3(): string {
        return this._property3;
    }

    public set property3(property3: string) {
        this._property3 = property3;
    }

    public get property4(): string {
        return this._property4;
    }

    public set property4(property4: string) {
        this._property4 = property4;
    }

    public get property5(): string {
        return this._property5;
    }

    public set property5(property5: string) {
        this._property5 = property5;
    }

    // ==================================================
    // FRONTEND PROPERTIES
    // ==================================================

    private _subscription: Subscription;
    private _marker: Marker;

    public get subscription(): Subscription {
        return this._subscription;
    }

    public get marker(): Marker {
        return this._marker;
    }

    public addSubscription(observable: Observable<IMqttMessage>): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this.subscribe(observable);
    }

    public addMarker(): Marker {
        if (this._marker) {
            this._marker.remove();
        }
        this._marker = new Marker({
            color: MarkerColourEnum.UNIT_GENERIC,
        })
            .setLngLat([this._unit.longitude, this._unit.latitude]);
        return this._marker;
    }

    private subscribe(observable: Observable<IMqttMessage>) {
        this._subscription = observable.subscribe(
            (data: IMqttMessage) => {
                let dataSplit: string[] = data.payload.toString().split(',');
                if (dataSplit[0]) {
                    this.data1 = dataSplit[0];
                }
                if (dataSplit[1]) {
                    this.data2 = dataSplit[1];
                }
                if (dataSplit[2]) {
                    this.data3 = dataSplit[2];
                }
                if (dataSplit[3]) {
                    this.data4 = dataSplit[3];
                }
                if (dataSplit[4]) {
                    this.data5 = dataSplit[4];
                }
            }
        );
    }

}