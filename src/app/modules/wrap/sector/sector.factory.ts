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
    target.id = source.id ? source.id : target.id;
    target.code = source.code ? source.code : target.code;
    target.name = source.name ? source.name : target.name;
    target.active = source.active ? source.active : target.active;
    target.description = source.description
      ? source.description
      : target.description;
    target.units = source.units ? source.units : target.units;
    target.created = source.created ? source.created : target.created;
    target.updated = source.updated ? source.created : target.created;
    target.image = source.image ? source.image : target.image;
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  public getSectorCreateDto(sector: SectorEntity): SectorCreateDto {
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

  public getSectorUpdateDto(sector: SectorEntity): SectorUpdateDto {
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
}
