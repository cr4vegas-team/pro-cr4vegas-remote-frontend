import { SectorEntity } from './sector.entity';

export interface SectorRO {
    sector: SectorEntity;
}

export interface SectorsRO {
    sectors: SectorEntity[],
    count: number;
}