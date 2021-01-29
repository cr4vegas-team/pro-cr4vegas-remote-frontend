import { TestBed } from '@angular/core/testing';

import { UserFactoryService } from '../user-factory.service';

describe('UserFactoryService', () => {
  let service: UserFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
