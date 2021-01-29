import { TestBed } from '@angular/core/testing';
import { UnitStationPechinaService } from './../unit-station-pechina.service';

describe('UnitStationService', () => {
  let service: UnitStationPechinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitStationPechinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
