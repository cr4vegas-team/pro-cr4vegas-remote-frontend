import { Map, Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MarkerColourEnum } from '../../../shared/constants/marker-colour.enum';
import { UnitPondStateEnum } from '../../../shared/constants/unit-pond-state.enum';
import { UnitEntity } from '../unit/unit.entity';

export class UnitPondEntity {

    constructor() {
        this._level$ = new BehaviorSubject<number>(this._level);
    }

    // ==================================================
    // API PROPERTIES
    // ==================================================

    private _id: number;
    private _unit: UnitEntity;
    private _m3: number;
    private _height: number;

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

    public get m3(): number {
        return this._m3;
    }

    public set m3(m3: number) {
        this._m3 = m3;
    }

    public get height(): number {
        return this._height;
    }

    public set height(height: number) {
        this._height = height;
    }

    // ==================================================
    // MQTT PROPERTIES
    // ==================================================

    private _level: number;
    private _level$: BehaviorSubject<number>;
    private _levelState: string;

    public get level$(): BehaviorSubject<number> {
        return this._level$;
    }

    public set level(level: number) {
        this._level = level;
        this._level$.next(this._level);
    }

    public get levelState(): string {
        return this._levelState;
    }

    public set levelState(levelState: string) {
        this._levelState = levelState;
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

    private subscribe(observable: Observable<IMqttMessage>) {
        this._subscription = observable.subscribe(
            (data: IMqttMessage) => {
                let dataSplit: string[] = data.payload.toString().split(',');
                if (dataSplit[0]) {
                    this._level = Number(dataSplit[0]);
                }
                this.checkLevelState();
            }
        );
    }

    public checkStatus() {
        this.checkLevelState();
    }

    private checkLevelState() {
        let bouysState: UnitPondStateEnum = null;
        if (this._level < this._height * 0.3) {
            bouysState = UnitPondStateEnum.LOW;
        }
        if (this._level >= this._height * 0.3 && this._level <= this._height * 0.6) {
            bouysState = UnitPondStateEnum.MEDIUM;
        }
        if (this._level > this._height * 0.6 && this._level < this._height * 0.9) {
            bouysState = UnitPondStateEnum.HIGTH;
        }
        if (this._level >= this._height * 0.9) {
            bouysState = UnitPondStateEnum.ALARM;
        }
        if (this._levelState !== bouysState) {
            this._levelState = bouysState;
            this.addMarker();
        }
    }

    public addMarker(): Marker {
        if (this._marker) {
            this._marker.remove();
        }
        this._marker = new Marker({
            color: this.getMarkerColourAccordingLevel(),
        })
            .setLngLat([this._unit.longitude, this._unit.latitude]);
        return this._marker;
    }

    private getMarkerColourAccordingLevel(): MarkerColourEnum {
        if (this._levelState) {
            if (this._levelState === UnitPondStateEnum.LOW) {
                return MarkerColourEnum.UNIT_POND_LOW;
            }
            if (this._levelState === UnitPondStateEnum.MEDIUM) {
                return MarkerColourEnum.UNIT_POND_MEDIUM;
            }
            if (this._levelState === UnitPondStateEnum.HIGTH) {
                return MarkerColourEnum.UNIT_POND_HIGTH;
            }
            if (this._levelState === UnitPondStateEnum.ALARM) {
                return MarkerColourEnum.ALARM;
            }
        } else {
            return MarkerColourEnum.UNIT_POND_LOW;
        }
    }

}