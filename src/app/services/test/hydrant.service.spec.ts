import { TestBed } from '@angular/core/testing';

import { HydrantService } from './hydrant.service';

describe('HydrantService', () => {
  let service: HydrantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
