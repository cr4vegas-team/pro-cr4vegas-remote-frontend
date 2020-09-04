import { UnitEntity } from '../../unit/unit/unit.entity';

export class SectorEntity {

    // API properties
    private _id: number;
    private _units: UnitEntity[];
    private _code: string;
    private _name: string;
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
        this._units = units;
    }

    public get code(): string {
        return this._code;
    }

    public set code(code: string) {
        this._code = code;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
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

    public get active(): number {
        return this._active;
    }

    public set active(active: number) {
        this._active = active;
    }

}