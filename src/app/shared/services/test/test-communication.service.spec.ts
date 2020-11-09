import { TestBed } from '@angular/core/testing';

import { TestCommunicationService } from '../test-communication.service';

describe('TestCommunicationService', () => {
  let service: TestCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
