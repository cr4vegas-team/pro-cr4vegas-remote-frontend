import { TestBed } from '@angular/core/testing';

import { UnitHydrantSocketService } from '../unit-hydrant-socket.service';

describe('UnitHydrantSocketService', () => {
  let service: UnitHydrantSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitHydrantSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
