import { UnitTypeEnum } from '../../../shared/constants/unit-type.enum';
import { SetEntity } from '../../wrap/set/set.entity';
import { StationEntity } from '../../wrap/station/station.entity';
import { SectorEntity } from '../../wrap/sector/sector.entity';

export class UnitEntity {

    // API properties
    private _id: number;
    private _code: string;
    private _table: string;
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
        this._code = code;
    }

    public get table(): string {
        return this._table;
    }

    public set table(table: string) {
        this._table = table;
    }

    public get unitType(): UnitTypeEnum {
        return this._unitType;
    }

    public set unitType(unitType: UnitTypeEnum) {
        this._unitType = unitType;
    }

    public get altitude(): number {
        return this._altitude;
    }

    public set altitude(altitude: number) {
        this._altitude = altitude;
    }

    public get latitude(): number {
        return this._latitude;
    }

    public set latitude(latitude: number) {
        this._latitude = latitude;
    }

    public get longitude(): number {
        return this._longitude;
    }

    public set longitude(longitude: number) {
        this._longitude = longitude;
    }

    public get station(): StationEntity {
        return this._station;
    }

    public set station(station: StationEntity) {
        this._station = station;
    }

    public get sector(): SectorEntity {
        return this._sector;
    }

    public set sector(sector: SectorEntity) {
        this._sector = sector;
    }

    public get sets(): SetEntity[] {
        return this._sets;
    }

    public set sets(sets: SetEntity[]) {
        this._sets = sets;
    }

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
    }

    public get active(): number {
        return this._active;
    }

    public set active(active: number) {
        this._active = active;
    }

    public get created(): Date {
        return this._created;
    }

    public set created(created: Date) {
        this._created = created;
    }

    public get updated(): Date {
        return this._updated;
    }

    public set updated(updated: Date) {
        this._updated = updated;
    }


}