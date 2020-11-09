import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestCommunicationService {
  constructor() {}

  // ==================================================
  //  TEST COMMUNICATION FUNCTIONS
  // ==================================================
  /* private loadTestCommunication(unitPond: UnitPondEntity): void {
    this.runTestCommunication(unitPond);
    unitPond.testInterval = setInterval(() => {
      this.runTestCommunication(unitPond);
    }, 300000);
  }

  private runTestCommunication(unitPond: UnitPondEntity): void {
    unitPond.unit.received = 0;
    this._mqttEventService.publishWithID(
      TopicDestinationEnum.NODE_SERVER,
      TopicTypeEnum.UNIT_POND,
      unitPond.id,
      '0'
    );
    setTimeout(() => {
      if (unitPond.unit.received === 0 && unitPond.unit.communication !== 0) {
        unitPond.unit.communication = 0;
        this.createMarker(unitPond);
      }
    }, 20000);
  } */
}
