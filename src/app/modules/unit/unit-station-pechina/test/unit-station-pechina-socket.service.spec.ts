import { TestBed } from '@angular/core/testing';

import { UnitStationPechinaSocketService } from '../unit-station-pechina-socket.service';

describe('UnitStationPechinaSocketService', () => {
  let service: UnitStationPechinaSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitStationPechinaSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
