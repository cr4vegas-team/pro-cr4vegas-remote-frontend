import { SetTypeEntity } from "./set-type.entity";
import { UnitEntity } from './unit.entity';


export class SetEntity {

    id: number;
    setType: SetTypeEntity;
    units: UnitEntity[];
    code: string;
    name: string;
    description: string;
    updated: Date;
    created: Date;
    active: boolean;

}