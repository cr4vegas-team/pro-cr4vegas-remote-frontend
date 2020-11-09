import { Test, TestingModule } from '@nestjs/testing';
import { TestCommunicationService } from './test-communication.service';

describe('TestCommunicationService', () => {
  let service: TestCommunicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestCommunicationService],
    }).compile();

    service = module.get<TestCommunicationService>(TestCommunicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
