import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
import { SetTypeEntity } from '../set-type.entity';


export class SetCreateDto {

    code: string;
    setType: SetTypeEntity;
    name: string;
    description: string;
    units: UnitEntity[];

}