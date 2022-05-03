import { Test, TestingModule } from '@nestjs/testing';
import { ExportationService } from './exportation.service';

describe('ExportationService', () => {
  let service: ExportationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportationService],
    }).compile();

    service = module.get<ExportationService>(ExportationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
