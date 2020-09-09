import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
import { SetTypeEntity } from '../set-type.entity';


export class SetUpdateDto {

    id: number;
    code: string;
    setType: SetTypeEntity;
    name: string;
    description: string;
    units: UnitEntity[];

}

export class SetTypeUpdateDto {
    oldName: string;
    newName: string;
}