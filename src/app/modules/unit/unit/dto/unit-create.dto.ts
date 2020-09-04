import { UnitTypeEnum } from 'src/app/shared/constants/unit-type.enum';

export class UnitCreateDto {

    code: string;
    stationId?: number | null;
    sectorId?: number | null;
    setsIds?: number[] | null;
    altitude: number;
    latitude: number;
    longitude: number;
    description: string;

}