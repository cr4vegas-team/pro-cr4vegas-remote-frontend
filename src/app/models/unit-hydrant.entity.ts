import { MatDialog } from '@angular/material/dialog';
import { Map, Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { DialogUnitHydrantComponent } from '../components/shared/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { BouyState } from '../constants/bouy-state.enum';
import { MarkerAnimationEnum } from '../constants/marker-animation.enum';
import { MarkerColourEnum } from '../constants/marker-colour.enum';
import { TopicTypeEnum } from '../constants/topic-type.enum';
import { MqttEventsService } from '../services/mqtt-events.service';
import { UnitEntity } from './unit.entity';

export class UnitHydrantEntity {

    private _map: Map;

    constructor(
        private readonly _matDialog: MatDialog,
        private readonly _mqttEventService: MqttEventsService,
    ) { }

    setMap(map: Map) {
        if (map) {
            this._map = map;
            if (this.marker) {
                this.marker.addTo(this._map);
            }
        }
    }

    // API properties
    private id: number;
    private unit: UnitEntity;
    private diameter: number;
    private filter: number;

    // MQTT properties
    private valve: boolean;
    private flow: number;
    private temperature: number;
    private humidity: number;
    private bouyLow: boolean;
    private bouyMedium: boolean;
    private bouyHight: boolean;
    private bouyState: BouyState;
    private bouyWarning: string;

    // FrontEnd properties
    private subscription: Subscription;
    private marker: Marker;

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getUnit(): UnitEntity {
        return this.unit;
    }

    public setUnit(unit: UnitEntity): void {
        this.unit = unit;
    }

    public getDiameter(): number {
        return this.diameter;
    }

    public setDiameter(diameter: number): void {
        this.diameter = diameter;
    }

    public getFilter(): number {
        return this.filter;
    }

    public setFilter(filter: number): void {
        this.filter = filter;
    }

    public isValve(): boolean {
        return this.valve;
    }

    public setValve(valve: boolean): void {
        this.valve = valve;
        this.setAnimationAccordingState();
    }

    public getFlow(): number {
        return this.flow;
    }

    public setFlow(flow: number): void {
        this.flow = flow;
    }

    public getTemperature(): number {
        return this.temperature;
    }

    public setTemperature(temperature: number): void {
        this.temperature = temperature;
    }

    public getHumidity(): number {
        return this.humidity;
    }

    public setHumidity(humidity: number): void {
        this.humidity = humidity;
    }

    public isBouyLow(): boolean {
        return this.bouyLow;
    }

    public setBouyLow(bouyLow: boolean): void {
        this.bouyLow = bouyLow;
    }

    public isBouyMedium(): boolean {
        return this.bouyMedium;
    }

    public setBouyMedium(bouyMedium: boolean): void {
        this.bouyMedium = bouyMedium;
    }

    public isBouyHight(): boolean {
        return this.bouyHight;
    }

    public setBouyHight(bouyHight: boolean): void {
        this.bouyHight = bouyHight;
    }

    public getBouyState(): BouyState {
        return this.bouyState;
    }

    public setBouyState(bouyState: BouyState): void {
        this.bouyState = bouyState;
    }

    public getBouyWarning(): string {
        return this.bouyWarning;
    }

    public setBouyWarning(bouyWarning: string): void {
        this.bouyWarning = bouyWarning;
    }

    public getSubscription(): Subscription {
        return this.subscription;
    }

    public setSubscription(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscribe();
    }

    public checkStatus() {
        this.checkBouysState();
        this.checkBouysWarnings();
    }

    private subscribe() {
        this.subscription = this._mqttEventService.subscribe(TopicTypeEnum.UNIT_HYDRANT, this.unit.getCode()).subscribe(
            (data: IMqttMessage) => {
                let dataSplit: string[] = data.payload.toString().split(',');
                if (dataSplit[0]) {
                    this.setValve(dataSplit[0] === '0' ? false : true);
                    this.setAnimationAccordingState();
                }
                if (dataSplit[1]) {
                    this.setFlow(Number.parseFloat(dataSplit[1]));
                }
                if (dataSplit[2]) {
                    this.setBouyLow(dataSplit[2] === '0' ? false : true);
                }
                if (dataSplit[3]) {
                    this.setBouyMedium(dataSplit[3] === '0' ? false : true);
                }
                if (dataSplit[4]) {
                    this.setBouyHight(dataSplit[4] === '0' ? false : true);
                }
                if (dataSplit[5]) {
                    this.setTemperature(Number.parseFloat(dataSplit[5]));
                }
                if (dataSplit[6]) {
                    this.setHumidity(Number.parseInt(dataSplit[6]));
                }
                this.checkBouysState();
                this.checkBouysWarnings();
            }
        );
    }

    private checkBouysState() {
        let bouysState: BouyState = null;
        if (!this.bouyLow) {
            bouysState = BouyState.LOW;
        }
        if (this.bouyLow) {
            bouysState = BouyState.MEDIUM;
        }
        if (this.bouyMedium) {
            bouysState = BouyState.HIGTH;
        }
        if (this.bouyHight) {
            bouysState = BouyState.ALARM;
        }
        if (this.bouyState !== bouysState) {
            this.bouyState = bouysState;
            this.setMarker();
        }
    }

    private checkBouysWarnings() {
        let bouysWarnings: string = '';
        if (!this.bouyLow && this.bouyMedium) {
            bouysWarnings = 'Comprobar las boyas baja y media. ';
        }
        if (!this.bouyLow && !this.bouyMedium && this.bouyHight) {
            bouysWarnings = 'Comprobar las boyas media y alta. ';
        }
        if ((this.bouyLow && this.bouyMedium && !this.bouyHight) ||
            (!this.bouyLow && this.bouyMedium && !this.bouyHight)) {
            bouysWarnings = `
              ${bouysWarnings}
              En el estado "${this.bouyState}" deberías tomar precaución. 
              La boya de Alarma de nivel solo se puede comprobar físicamente`;
        }
        this.bouyWarning = bouysWarnings;
    }

    public getMarker(): Marker {
        return this.marker;
    }

    public setMarker(): void {
        if (this.marker) {
            this.marker.remove();
        }
        this.marker = new Marker({
            color: this.getMarkerColourAccordingBouyState(),
        })
            .setLngLat([this.unit.getLongitude(), this.unit.getLatitude()]);

        this.marker.getElement().onclick = () => this._matDialog.open(DialogUnitHydrantComponent, { data: this, maxWidth: '70%', maxHeight: '80%' });
        this.setAnimationAccordingState();
    }

    private setAnimationAccordingState() {
        if (this.valve) {
            this.marker.getElement().style.animation = 'fade 0.5s 0.5s infinite linear both';
            if (this.bouyState === BouyState.ALARM) {
                this.marker.getElement().style.boxShadow = `${MarkerAnimationEnum.CLOSED}`;
            } else {
                this.marker.getElement().style.boxShadow = `${MarkerAnimationEnum.OPEN}`;
            }
            this.marker.getElement().style.borderRadius = '50%';
        } else {
            this.marker.getElement().style.animation = MarkerAnimationEnum.NONE;
            this.marker.getElement().style.boxShadow = MarkerAnimationEnum.NONE;
        }
    }

    private getMarkerColourAccordingBouyState(): MarkerColourEnum {
        if (this.bouyState) {
            if (this.bouyState === BouyState.LOW) {
                return MarkerColourEnum.UNIT_HYDRANT_LOW;
            }
            if (this.bouyState === BouyState.MEDIUM) {
                return MarkerColourEnum.UNIT_HYDRANT_MEDIUM;
            }
            if (this.bouyState === BouyState.HIGTH) {
                return MarkerColourEnum.UNIT_HYDRANT_HIGTH;
            }
            if (this.bouyState === BouyState.ALARM) {
                return MarkerColourEnum.ALARM;
            }
        } else {
            return MarkerColourEnum.UNIT_HYDRANT_LOW;
        }
    }

}