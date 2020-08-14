import { UnitEntity } from './unit.entity';


export class SectorEntity {

    id: number;
    units: UnitEntity[];
    code: string;
    name: string;
    description: string;
    updated: Date;
    created: Date;
    active: boolean;

}