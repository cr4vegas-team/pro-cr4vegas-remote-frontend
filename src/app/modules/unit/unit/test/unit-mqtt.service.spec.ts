import { TestBed } from '@angular/core/testing';

import { UnitMqttService } from '../unit-mqtt.service';

describe('UnitMqttService', () => {
  let service: UnitMqttService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitMqttService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
