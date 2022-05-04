import { Test, TestingModule } from '@nestjs/testing';
import { Product } from 'src/product/entities/product.entity';

const fsMock = {
  readdir: jest.fn(),
  mkdir: jest.fn(),
}

jest.mock('fs/promises', ()=> fsMock)

import { ExportationService } from './exportation.service';


describe('ExportationService', () => {
  let service: ExportationService<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportationService],
    }).compile();

    service = module.get<ExportationService<Product>>(ExportationService);

    Object.keys(fsMock).forEach((key) => {
      fsMock[key].mockReset();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit()', () => {
    it('should not create temp if it exists', () => {
      fsMock.readdir.mockResolvedValue(['temp', 'pasta2'])
      service.onModuleInit()
      expect(fsMock.readdir.mock.calls.length).toBe(1);
      expect(fsMock.mkdir.mock.calls.length).toBe(0);
    });
  
    it('should create temp if it does not exists', async () => {
      fsMock.readdir.mockResolvedValue(['pasta1', 'pasta2'])
      await service.onModuleInit()
      expect(fsMock.readdir.mock.calls.length).toBe(1);
      expect(fsMock.mkdir.mock.calls.length).toBe(1);
    });
  })
});
