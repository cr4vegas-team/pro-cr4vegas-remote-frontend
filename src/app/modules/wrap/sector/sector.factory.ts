import { SectorWSDto } from './dto/sector-ws.dto';
import { Injectable } from '@angular/core';
import { IMqttMessage } from 'ngx-mqtt';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { SectorCreateDto } from './dto/sector-create.dto';
import { SectorUpdateDto } from './dto/sector-update.dto';
import { SectorEntity } from './sector.entity';

@Injectable({
  providedIn: 'root',
})
export class SectorFactory {
  // ==================================================
  //  FACTORY FUNCTIONS
  // ==================================================
  public createSector(source: any): SectorEntity {
    const sector: SectorEntity = new SectorEntity();
    if (source) {
      sector.id = source.id;
      sector.code = source.code;
      sector.name = source.name;
      sector.active = source.active;
      sector.description = source.description;
      sector.units = source.units;
      sector.created = source.created;
      sector.updated = source.updated;
      sector.image = source.image;
    }
    return sector;
  }

  public updateSector(target: SectorEntity, source: SectorEntity): void {
    target.id = source.id;
    target.code = source.code;
    target.name = source.name;
    target.active = source.active;
    target.description = source.description;
    target.units = source.units;
    target.created = source.created;
    target.updated = source.updated;
    target.image = source.image;
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  public getSectorCreateDto(sector: any): SectorCreateDto {
    const sectorCreateDto: SectorCreateDto = new SectorCreateDto();
    sectorCreateDto.code = sector.code;
    sectorCreateDto.name = sector.name;
    sectorCreateDto.description = sector.description;
    sectorCreateDto.active = sector.active;
    sectorCreateDto.image = sector.image;
    sectorCreateDto.units = sector.units
      ? sector.units.map((unit) => unit.id)
      : [];
    return sectorCreateDto;
  }

  public getSectorUpdateDto(sector: any): SectorUpdateDto {
    const sectorUpdateDto: SectorUpdateDto = new SectorUpdateDto();
    sectorUpdateDto.id = sector.id;
    sectorUpdateDto.code = sector.code;
    sectorUpdateDto.name = sector.name;
    sectorUpdateDto.description = sector.description;
    sectorUpdateDto.active = sector.active;
    sectorUpdateDto.image = sector.image;
    sectorUpdateDto.units = sector.units
      ? sector.units.map((unit) => unit.id)
      : [];
    return sectorUpdateDto;
  }

  public getSectorWSDto(sector: any): SectorWSDto {
    const sectorWSDto: SectorWSDto = new SectorWSDto();
    sectorWSDto.id = sector.id;
    sectorWSDto.code = sector.code;
    sectorWSDto.name = sector.name;
    sectorWSDto.description = sector.description;
    sectorWSDto.active = sector.active;
    sectorWSDto.image = sector.image;
    sectorWSDto.units = sector.units ? sector.units : [];
    return sectorWSDto;
  }
}
