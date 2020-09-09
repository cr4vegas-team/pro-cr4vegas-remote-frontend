import { SectorEntity } from 'src/app/modules/wrap/sector/sector.entity';
import { SetEntity } from 'src/app/modules/wrap/set/set.entity';
import { StationEntity } from 'src/app/modules/wrap/station/station.entity';


export class UnitUpdateDto {

    id: number;
    code: string;
    station?: StationEntity | null;
    sector?: SectorEntity | null;
    sets?: SetEntity[] | null;
    altitude: number;
    latitude: number;
    longitude: number;
    description: string;

}