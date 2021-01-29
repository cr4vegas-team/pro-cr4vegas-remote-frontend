import { TestBed } from '@angular/core/testing';

import { UnitStationPechinaMqttService } from '../unit-station-pechina-mqtt.service';

describe('UnitStationPechinaMqttService', () => {
  let service: UnitStationPechinaMqttService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitStationPechinaMqttService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
