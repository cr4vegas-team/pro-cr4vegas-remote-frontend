import { TestBed } from '@angular/core/testing';

import { UnitHydrantMqttService } from '../unit-hydrant-mqtt.service';

describe('UnitHydrantMqttService', () => {
  let service: UnitHydrantMqttService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitHydrantMqttService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
