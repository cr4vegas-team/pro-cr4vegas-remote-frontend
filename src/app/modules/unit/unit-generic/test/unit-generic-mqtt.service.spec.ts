import { TestBed } from '@angular/core/testing';

import { UnitGenericMqttService } from '../unit-generic-mqtt.service';

describe('UnitGenericMqttService', () => {
  let service: UnitGenericMqttService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitGenericMqttService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
