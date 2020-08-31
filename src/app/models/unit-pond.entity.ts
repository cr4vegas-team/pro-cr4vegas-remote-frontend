import { MatDialog } from '@angular/material/dialog';
import { Map, Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { DialogUnitHydrantComponent } from '../components/shared/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { DialogUnitPondComponent } from '../components/shared/dialog-unit-pond/dialog-unit-pond.component';
import { BouyState } from '../constants/bouy-state.enum';
import { MarkerColourEnum } from '../constants/marker-colour.enum';
import { TopicTypeEnum } from '../constants/topic-type.enum';
import { MqttEventsService } from '../services/mqtt-events.service';
import { UnitEntity } from './unit.entity';

export class UnitPondEntity {

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
    private m3: number;
    private height: number;

    // MQTT properties
    private level: number;
    private levelState: string;

    // FrontEnd properties
    private subscription: Subscription;
    private marker: Marker;

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getM3(): number {
        return this.m3;
    }

    public setM3(m3: number): void {
        this.m3 = m3;
    }

    public getHeight(): number {
        return this.height;
    }

    public setHeight(height: number): void {
        this.height = height;
    }

    public getUnit(): UnitEntity {
        return this.unit;
    }

    public setUnit(unit: UnitEntity): void {
        this.unit = unit;
    }

    public getLevel(): number {
        return this.level;
    }

    public setLevel(level: any): void {
        this.level = Number(level);
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
        this.checkLevelState();
    }

    private subscribe() {
        this.subscription = this._mqttEventService.subscribe(TopicTypeEnum.UNIT_POND, this.unit.getCode()).subscribe(
            (data: IMqttMessage) => {
                let dataSplit: string[] = data.payload.toString().split(',');
                if (dataSplit[0]) {
                    this.setLevel(dataSplit[0]);
                }
                this.checkLevelState();
            }
        );
    }

    private checkLevelState() {
        let bouysState: BouyState = null;
        if (this.level < 3) {
            bouysState = BouyState.LOW;
        }
        if (this.level >= 3 && this.level <= 6) {
            bouysState = BouyState.MEDIUM;
        }
        if (this.level > 6 && this.level < 9) {
            bouysState = BouyState.HIGTH;
        }
        if (this.level >= 9) {
            bouysState = BouyState.ALARM;
        }
        if (this.levelState !== bouysState) {
            this.levelState = bouysState;
            this.setMarker();
        }
    }

    public getMarker(): Marker {
        return this.marker;
    }

    public setMarker(): void {
        if (this.marker) {
            this.marker.remove();
        }
        this.marker = new Marker({
            color: this.getMarkerColourAccordingLevel(),
        })
            .setLngLat([this.unit.getLongitude(), this.unit.getLatitude()]);

        this.marker.getElement().onclick = () => this._matDialog.open(DialogUnitPondComponent, { data: this });
    }

    private getMarkerColourAccordingLevel(): MarkerColourEnum {
        if (this.levelState) {
            if (this.levelState === BouyState.LOW) {
                return MarkerColourEnum.UNIT_POND_LOW;
            }
            if (this.levelState === BouyState.MEDIUM) {
                return MarkerColourEnum.UNIT_POND_MEDIUM;
            }
            if (this.levelState === BouyState.HIGTH) {
                return MarkerColourEnum.UNIT_POND_HIGTH;
            }
            if (this.levelState === BouyState.ALARM) {
                return MarkerColourEnum.ALARM;
            }
        } else {
            return MarkerColourEnum.UNIT_POND_LOW;
        }
    }

    public getLevelState(): string {
        return this.levelState;
    }

}