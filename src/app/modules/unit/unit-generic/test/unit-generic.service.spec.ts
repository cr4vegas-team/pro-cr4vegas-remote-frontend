import { TestBed } from '@angular/core/testing';

import { UnitGenericService } from '../unit-generic.service';

describe('UnitGenericService', () => {
  let service: UnitGenericService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitGenericService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
