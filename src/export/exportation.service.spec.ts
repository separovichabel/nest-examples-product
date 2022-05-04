import { Test, TestingModule } from '@nestjs/testing';
import { Product } from 'src/product/entities/product.entity';
import { ExportationService } from './exportation.service';

describe('ExportationService', () => {
  let service: ExportationService<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportationService],
    }).compile();

    service = module.get<ExportationService<Product>>(ExportationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
