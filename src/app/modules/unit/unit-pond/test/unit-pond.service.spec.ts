import { TestBed } from '@angular/core/testing';

import { UnitPondService } from '../unit-pond.service';

describe('UnitPondService', () => {
  let service: UnitPondService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitPondService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
