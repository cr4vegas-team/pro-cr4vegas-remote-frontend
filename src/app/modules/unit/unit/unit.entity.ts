import { UnitTypeEnum } from '../../../shared/constants/unit-type.enum';
import { UnitTypeTableEnum } from '../../../shared/constants/unit-type-table.enum';
import { SetEntity } from '../../wrap/set/set.entity';
import { StationEntity } from '../../wrap/station/station.entity';
import { SectorEntity } from '../../wrap/sector/sector.entity';
import { error } from 'console';

export class UnitEntity {

    // API properties
    private _id: number;
    private _code: string;
    private _table: UnitTypeTableEnum;
    private _unitType: UnitTypeEnum;
    private _altitude: number;
    private _latitude: number;
    private _longitude: number;
    private _station: StationEntity;
    private _sector: SectorEntity;
    private _sets: SetEntity[];
    private _description: string;
    private _active: number;
    private _created: Date;
    private _updated: Date;

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get code(): string {
        return this._code;
    }

    public set code(code: string) {
        if (!code || !code.match(/(HD||VT|VV|BS|HB|CM|MC)([0-9]{6})/)) {
            throw new Error(`<p>El código es incorrecto. Ejemplo: HD000150. Código + 6 dígitos. Códigos:</p>
                            <ul>
                                <li>GN = Genérico</li>
                                <li>HD = Hidrante</li>
                                <li>VT = Ventosa</li>
                                <li>VV = Válvula</li>
                                <li>BS = Balsa</li>
                                <li>HB = Habitáculo</li>
                                <li>CM = Cámara</li>
                            </ul>
                            `)
        }
        this._code = code;
    }

    public get table(): UnitTypeTableEnum {
        return this._table;
    }

    public set table(table: UnitTypeTableEnum) {
        this._table = table;
    }

    public get unitType(): UnitTypeEnum {
        return this._unitType;
    }

    public set unitType(unitType: UnitTypeEnum) {
        if(unitType) {
            this._unitType = unitType;
        }
    }

    public get altitude(): number {
        return this._altitude;
    }

    public set altitude(altitude: number) {
        if(!altitude || altitude < 0 || altitude > 1000) {
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

    public get station(): StationEntity {
        return this._station;
    }

    public set station(station: StationEntity) {
        if(station) {
            this._station = station;
        } else {
            this._station = null;
        }
    }

    public get sector(): SectorEntity {
        return this._sector;
    }

    public set sector(sector: SectorEntity) {
        if(sector) {
            this._sector = sector;
        } else {
            this._sector = null;
        }
    }

    public get sets(): SetEntity[] {
        return this._sets;
    }

    public set sets(sets: SetEntity[]) {
        if(sets) {
            this._sets = sets;
        } else {
            this._sets = [];
        }
    }

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        if(description) {
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
        }
    }

    public get created(): Date {
        return this._created;
    }

    public set created(created: Date) {
        if(created) {
            this._created = created;
        }
    }

    public get updated(): Date {
        return this._updated;
    }

    public set updated(updated: Date) {
        if(updated) {
            this._updated = updated;
        }
    }


}