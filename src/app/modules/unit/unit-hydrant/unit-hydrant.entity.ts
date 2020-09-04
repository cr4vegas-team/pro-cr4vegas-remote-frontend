import { Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { Observable, Subscription } from 'rxjs';
import { MarkerAnimationEnum } from '../../../shared/constants/marker-animation.enum';
import { MarkerColourEnum } from '../../../shared/constants/marker-colour.enum';
import { UnitPondStateEnum } from '../../../shared/constants/unit-pond-state.enum';
import { UnitEntity } from '../unit/unit.entity';

export class UnitHydrantEntity {

    // ==================================================
    // API properties
    // ==================================================

    private _id: number;
    private _unit: UnitEntity;
    private _diameter: number;
    private _filter: number;

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

    public get diameter(): number {
        return this._diameter;
    }

    public set diameter(diameter: number) {
        this._diameter = diameter;
    }

    public get filter(): number {
        return this._filter;
    }

    public set filter(filter: number) {
        this._filter = filter;
    }

    // ==================================================
    //  MQTT PROPERTIES
    // ==================================================

    private _valve: number;
    private _flow: number;
    private _bouyLow: boolean;
    private _bouyMedium: boolean;
    private _bouyHight: boolean;
    private _bouyState: UnitPondStateEnum;
    private _bouyWarning: string;

    public get valve(): number {
        return this._valve;
    }

    public set valve(valve: number) {
        this._valve = valve;
        this.setAnimationAccordingState();
    }

    public get flow(): number {
        return this._flow;
    }

    public set flow(flow: number) {
        this._flow = flow;
    }

    public get temperature(): number {
        return this.temperature;
    }

    public set temperature(temperature: number) {
        this.temperature = temperature;
    }

    public get humidity(): number {
        return this.humidity;
    }

    public set humidity(humidity: number) {
        this.humidity = humidity;
    }

    public get bouyLow(): boolean {
        return this._bouyLow;
    }

    public set bouyLow(bouyLow: boolean) {
        this._bouyLow = bouyLow;
    }

    public get bouyMedium(): boolean {
        return this._bouyMedium;
    }

    public set bouyMedium(bouyMedium: boolean) {
        this._bouyMedium = bouyMedium;
    }

    public get bouyHight(): boolean {
        return this._bouyHight;
    }

    public set bouyHight(bouyHight: boolean) {
        this._bouyHight = bouyHight;
    }

    public get bouyState(): UnitPondStateEnum {
        return this._bouyState;
    }

    public set bouyState(bouyState: UnitPondStateEnum) {
        this._bouyState = bouyState;
    }

    public get bouyWarning(): string {
        return this._bouyWarning;
    }

    public set bouyWarning(bouyWarning: string) {
        this._bouyWarning = bouyWarning;
    }

    // ==================================================
    // FRONTEND PROPERTIES
    // ==================================================

    private _subscription: Subscription;
    private _marker: Marker;

    public get marker(): Marker {
        return this._marker;
    }

    public get subscription(): Subscription {
        return this._subscription;
    }

    public addSubscription(observable: Observable<IMqttMessage>): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this.subscribe(observable);
    }

    private subscribe(observable: Observable<IMqttMessage>) {
        this._subscription = observable.subscribe(
            (data: IMqttMessage) => {
                let dataSplit: string[] = data.payload.toString().split(',');
                if (dataSplit[0]) {
                    this.valve = dataSplit[0] === '0' ? 0 : 1;
                    this.setAnimationAccordingState();
                }
                if (dataSplit[1]) {
                    this.flow = Number.parseFloat(dataSplit[1]);
                }
                if (dataSplit[2]) {
                    this.bouyLow = dataSplit[2] === '0' ? false : true;
                }
                if (dataSplit[3]) {
                    this.bouyMedium = dataSplit[3] === '0' ? false : true;
                }
                if (dataSplit[4]) {
                    this.bouyHight = dataSplit[4] === '0' ? false : true;
                }
                this.checkBouysState();
                this.checkBouysWarnings();
            }
        );
    }

    public checkStatus() {
        this.checkBouysState();
        this.checkBouysWarnings();
    }

    private checkBouysState() {
        let bouysState: UnitPondStateEnum = null;
        if (!this._bouyLow) {
            bouysState = UnitPondStateEnum.LOW;
        }
        if (this._bouyLow) {
            bouysState = UnitPondStateEnum.MEDIUM;
        }
        if (this._bouyMedium) {
            bouysState = UnitPondStateEnum.HIGTH;
        }
        if (this._bouyHight) {
            bouysState = UnitPondStateEnum.ALARM;
        }
        if (this._bouyState !== bouysState) {
            this._bouyState = bouysState;
            this.addMarker();
        }
    }

    private checkBouysWarnings() {
        let bouysWarnings: string = '';
        if (!this._bouyLow && this._bouyMedium) {
            bouysWarnings = 'Comprobar las boyas baja y media. ';
        }
        if (!this._bouyLow && !this._bouyMedium && this._bouyHight) {
            bouysWarnings = 'Comprobar las boyas media y alta. ';
        }
        if ((this._bouyLow && this._bouyMedium && !this._bouyHight) ||
            (!this._bouyLow && this._bouyMedium && !this._bouyHight)) {
            bouysWarnings = `
              ${bouysWarnings}
              En el estado "${this._bouyState}" deberías tomar precaución. 
              La boya de Alarma de nivel solo se puede comprobar físicamente`;
        }
        this._bouyWarning = bouysWarnings;
    }

    public addMarker(): Marker {
        if (this._marker) {
            this._marker.remove();
        }
        this._marker = new Marker({
            color: this.getMarkerColourAccordingBouyState(),
        })
            .setLngLat([this._unit.longitude, this._unit.latitude]);

        this.setAnimationAccordingState();
        return this._marker;
    }

    private setAnimationAccordingState() {
        if (this._valve) {
            this._marker.getElement().style.animation = 'fade 0.5s 0.5s infinite linear both';
            if (this._bouyState === UnitPondStateEnum.ALARM) {
                this._marker.getElement().style.boxShadow = `${MarkerAnimationEnum.CLOSED}`;
            } else {
                this._marker.getElement().style.boxShadow = `${MarkerAnimationEnum.OPEN}`;
            }
            this._marker.getElement().style.borderRadius = '50%';
        } else {
            this._marker.getElement().style.animation = MarkerAnimationEnum.NONE;
            this._marker.getElement().style.boxShadow = MarkerAnimationEnum.NONE;
        }
    }

    private getMarkerColourAccordingBouyState(): MarkerColourEnum {
        if (this._bouyState) {
            if (this._bouyState === UnitPondStateEnum.LOW) {
                return MarkerColourEnum.UNIT_HYDRANT_LOW;
            }
            if (this._bouyState === UnitPondStateEnum.MEDIUM) {
                return MarkerColourEnum.UNIT_HYDRANT_MEDIUM;
            }
            if (this._bouyState === UnitPondStateEnum.HIGTH) {
                return MarkerColourEnum.UNIT_HYDRANT_HIGTH;
            }
            if (this._bouyState === UnitPondStateEnum.ALARM) {
                return MarkerColourEnum.ALARM;
            }
        } else {
            return MarkerColourEnum.UNIT_HYDRANT_LOW;
        }
    }

}