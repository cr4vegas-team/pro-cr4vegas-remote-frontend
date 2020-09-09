import { Marker } from 'mapbox-gl';
import { MarkerColourEnum } from '../../../shared/constants/marker-colour.enum';
import { UnitEntity } from '../../unit/unit/unit.entity';


export class StationEntity {

    // ==================================================
    // API PROPERTIES
    // ==================================================

    private _id: number;
    private _units: UnitEntity[];
    private _code: string;
    private _name: string;
    private _altitude: number;
    private _latitude: number;
    private _longitude: number;
    private _description: string;
    private _updated: Date;
    private _created: Date;
    private _active: number;

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get units(): UnitEntity[] {
        return this._units;
    }

    public set units(units: UnitEntity[]) {
        if (units) {
            this._units = units;
        } else {
            units = [];
        }
    }

    public get code(): string {
        return this._code;
    }

    public set code(code: string) {
        if (!code.match(/(ET)([0-9]{6})/)) {
            throw new Error(`<p>El código es incorrecto. Ejemplo: ET000111. Código + 6 dígitos. Código:</p>
                            <ul>
                                <li>ET = Estación</li>
                            </ul>
                            `)
        }
        this._code = code;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        if (!name) {
            throw new Error('El nombre de la estación no puede quedar vacío')
        }
        this._name = name;
    }

    public get altitude(): number {
        return this._altitude;
    }

    public set altitude(altitude: number) {
        if (!altitude || altitude < 0 || altitude > 1000) {
            throw new Error('La altitud debe estar entre 0 y 1000');
        }
        this._altitude = altitude;
    }

    public get latitude(): number {
        return this._latitude;
    }

    public set latitude(latitude: number) {
        if (!latitude || latitude > 90 || latitude < -90) {
            throw new Error('La altitud debe estar entre -90 y 90')
        }
        this._latitude = latitude;
    }

    public get longitude(): number {
        return this._longitude;
    }

    public set longitude(longitude: number) {
        if (!longitude || longitude > 90 || longitude < -90) {
            throw new Error('La longitud debe estar entre -90 y 90')
        }
        this._longitude = longitude;
    }

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        if (description) {
            this._description = description;
        } else {
            this._description = '';
        }
    }

    public get active(): number {
        return this._active;
    }

    public set active(active: number) {
        if(active) {
            this._active = active;
        } else {
            this._active = 0;
        }
    }

    public get updated(): Date {
        return this._updated;
    }

    public set updated(updated: Date) {
        this._updated = updated;
    }

    public get created(): Date {
        return this._created;
    }

    public set created(created: Date) {
        this._created = created;
    }

    // ==================================================
    // FRONTEND PROPERTIES
    // ==================================================

    private _marker: Marker;

    public get marker(): Marker {
        return this._marker;
    }

    public addMarker(): Marker {
        if (this._marker) {
            this._marker.remove();
        }
        this._marker = new Marker({
            color: MarkerColourEnum.STATION,
        })
            .setLngLat([this.longitude, this.latitude]);
        return this._marker;
    }

}