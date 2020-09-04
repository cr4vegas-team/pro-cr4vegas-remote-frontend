import { StationEntity } from './station.entity';

export interface StationRO {
    station: StationEntity,
}

export interface StationsRO {
    stations: StationEntity[],
    count: number,
}