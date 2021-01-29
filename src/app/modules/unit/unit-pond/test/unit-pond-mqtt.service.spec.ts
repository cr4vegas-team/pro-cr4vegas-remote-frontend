import { TestBed } from '@angular/core/testing';

import { UnitPondMqttService } from '../unit-pond-mqtt.service';

describe('UnitPondMqttService', () => {
  let service: UnitPondMqttService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitPondMqttService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
