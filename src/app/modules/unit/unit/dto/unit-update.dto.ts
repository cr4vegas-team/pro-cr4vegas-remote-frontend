

export class UnitUpdateDto {

    id: number;
    code: string;
    stationId?: number | null;
    sectorId?: number | null;
    setsIds?: number[] | null;
    altitude: number;
    latitude: number;
    longitude: number;
    description: string;

}