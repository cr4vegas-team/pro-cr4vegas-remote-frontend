import { TestBed } from '@angular/core/testing';

import { MqttEventService } from './mqtt-event.service';

describe('MqttEventService', () => {
  let service: MqttEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
