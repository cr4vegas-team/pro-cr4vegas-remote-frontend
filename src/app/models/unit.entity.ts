import { UnitTypeEnum } from '../constants/unit-type.enum';
import { SectorEntity } from './sector.entity';
import { SetEntity } from './set.entity';
import { StationEntity } from './station.entity';

export class UnitEntity {

    // API properties
    private id: number;
    private code: string;
    private table: string;
    private unitType: UnitTypeEnum;
    private altitude: number;
    private latitude: number;
    private longitude: number;
    private station: StationEntity;
    private sector: SectorEntity;
    private sets: SetEntity[];
    private description: string;
    private active: number;
    private created: Date;
    private updated: Date;

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getCode(): string {
        return this.code;
    }

    public setCode(code: string): void {
        this.code = code;
    }

    public getTable(): string {
        return this.table;
    }

    public setTable(table: string): void {
        this.code = table;
    }

    public getUnitType(): UnitTypeEnum {
        return this.unitType;
    }

    public setUnitType(unitType: UnitTypeEnum): void {
        this.unitType = unitType;
    }

    public getAltitude(): number {
        return this.altitude;
    }

    public setAltitude(altitude: number): void {
        this.altitude = altitude;
    }

    public getLatitude(): number {
        return this.latitude;
    }

    public setLatitude(latitude: number): void {
        this.latitude = latitude;
    }

    public getLongitude(): number {
        return this.longitude;
    }

    public setLongitude(longitude: number): void {
        this.longitude = longitude;
    }

    public getStation(): StationEntity {
        return this.station;
    }

    public setStation(station: StationEntity): void {
        this.station = station;
    }

    public getSector(): SectorEntity {
        return this.sector;
    }

    public setSector(sector: SectorEntity): void {
        this.sector = sector;
    }

    public getSets(): SetEntity[] {
        return this.sets;
    }

    public setSets(sets: SetEntity[]): void {
        this.sets = sets;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public getActive(): number {
        return this.active;
    }

    public setActive(active: number): void {
        this.active = active;
    }

    public getCreated(): Date {
        return this.created;
    }

    public setCreated(created: Date): void {
        this.created = created;
    }

    public getUpdated(): Date {
        return this.updated;
    }

    public setUpdated(updated: Date): void {
        this.updated = updated;
    }

}