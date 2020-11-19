import { Injectable } from '@angular/core';
import { UnitGenericFactory } from 'src/app/modules/unit/unit-generic/unit-generic.factory';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { UnitHydrantFactory } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.factory';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { UnitPondFactory } from 'src/app/modules/unit/unit-pond/unit-pond.factory';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { TopicDestinationEnum } from '../constants/topic-destination.enum';

@Injectable({
  providedIn: 'root',
})
export class TestCommunicationService {
  private _interval = 300000;
  private _timeOut = 60000;

  constructor(
    private readonly _mqttEventService: MqttEventsService,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitGenericFactory: UnitGenericFactory,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _unitPondService: UnitPondService,
    private readonly _unitPondFactory: UnitPondFactory
  ) {}

  public startTest(): void {
    this.initCommunicationTest();
  }

  private initCommunicationTest(): void {
    this.runTest();
    setInterval(() => {
      this.runTest();
    }, this._interval);
  }

  private runTest(): void {
    this.unitGenericSendMessageToNode();
    this.unitHydrantSendMessageToNode();
    this.unitPondSendMessageToNode();
    setTimeout(() => {
      this.unitGenericCheckReceived();
      this.unitHydrantCheckReceived();
      this.unitPondCheckReceived();
    }, this._timeOut);
  }

  // ==================================================
  //  UNIT GENERIC
  // ==================================================
  private unitGenericSendMessageToNode(): void {
    this._unitGenericService.getUnitsGeneric().value.forEach((unitGeneric) => {
      this.sendTestMessageToNode(TopicTypeEnum.UNIT_GENERIC, unitGeneric.id);
      unitGeneric.unit.received = 0;
    });
  }

  private unitGenericCheckReceived(): void {
    this._unitGenericService.getUnitsGeneric().value.forEach((unitGeneric) => {
      if (unitGeneric.unit.received === 1) {
        if (unitGeneric.unit.communication !== 1) {
          unitGeneric.unit.communication = 1;
          this._unitGenericFactory.setMarkerState(unitGeneric);
        }
      } else {
        if (unitGeneric.unit.communication !== 0) {
          unitGeneric.unit.communication = 0;
          this._unitGenericFactory.setMarkerState(unitGeneric);
        }
      }
    });
  }

  // ==================================================
  //  UNIT HYDRANT
  // ==================================================
  private unitHydrantSendMessageToNode(): void {
    this._unitHydrantService.getUnitsHydrants().value.forEach((unitHydrant) => {
      this.sendTestMessageToNode(TopicTypeEnum.UNIT_HYDRANT, unitHydrant.id);
      unitHydrant.unit.received = 0;
    });
  }

  private unitHydrantCheckReceived(): void {
    this._unitHydrantService.getUnitsHydrants().value.forEach((unitHydrant) => {
      if (unitHydrant.unit.received === 1) {
        if (unitHydrant.unit.communication !== 1) {
          unitHydrant.unit.communication = 1;
          this._unitHydrantFactory.setMarkerState(unitHydrant);
        }
      } else {
        if (unitHydrant.unit.communication !== 0) {
          unitHydrant.unit.communication = 0;
          this._unitHydrantFactory.setMarkerState(unitHydrant);
        }
      }
    });
  }

  // ==================================================
  //  UNIT POND
  // ==================================================
  private unitPondSendMessageToNode(): void {
    this._unitPondService.getUnitsPonds().value.forEach((unitPond) => {
      this.sendTestMessageToNode(TopicTypeEnum.UNIT_POND, unitPond.id);
      unitPond.unit.received = 0;
    });
  }

  private unitPondCheckReceived(): void {
    this._unitPondService.getUnitsPonds().value.forEach((unitPond) => {
      if (unitPond.unit.received === 1) {
        if (unitPond.unit.communication !== 1) {
          unitPond.unit.communication = 1;
          this._unitPondFactory.setMarkerState(unitPond);
        }
      } else {
        if (unitPond.unit.communication !== 0) {
          unitPond.unit.communication = 0;
          this._unitPondFactory.setMarkerState(unitPond);
        }
      }
    });
  }

  // ==================================================
  //  SEND MESSAGE TO NODE
  // ==================================================
  private sendTestMessageToNode(topicType: TopicTypeEnum, id: number): void {
    this._mqttEventService.publishWithID(
      TopicDestinationEnum.NODE_SERVER,
      topicType,
      id,
      '1'
    );
  }
}
