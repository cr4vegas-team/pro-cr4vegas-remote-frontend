import { UnitStationPechinaFactoryService } from './../unit-station-pechina-factory.service';
import { TestBed } from '@angular/core/testing';


describe('UnitStationFactoryService', () => {
  let service: UnitStationPechinaFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitStationPechinaFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
