import { TestBed } from '@angular/core/testing';
import { UnitHydrantService } from '../unit-hydrant.service';

describe('HydrantService', () => {
  let service: UnitHydrantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitHydrantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
