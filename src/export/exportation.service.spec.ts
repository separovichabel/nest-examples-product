import { Test, TestingModule } from '@nestjs/testing';
import { Product } from 'src/product/entities/product.entity';
import { Writable } from 'stream';

const fsPMock = {
  readdir: jest.fn(),
  mkdir: jest.fn(),
};


const exportService = {
  findAll: jest.fn(),
  create: jest.fn(),
};

jest.mock('fs/promises', () => fsPMock);

import { ExportationService } from './exportation.service';

describe('ExportationService', () => {
  let service: ExportationService<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportationService],
    }).compile();

    service = module.get<ExportationService<Product>>(ExportationService);

    Object.keys(fsPMock).forEach((key) => {
      fsPMock[key].mockReset();
    });

    Object.keys(exportService).forEach((key) => {
      exportService[key].mockReset();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit()', () => {
    it('should not create temp if it exists', () => {
      fsPMock.readdir.mockResolvedValue(['temp', 'pasta2']);
      service.onModuleInit();
      expect(fsPMock.readdir.mock.calls.length).toBe(1);
      expect(fsPMock.mkdir.mock.calls.length).toBe(0);
    });

    it('should create temp if it does not exists', async () => {
      fsPMock.readdir.mockResolvedValue(['pasta1', 'pasta2']);
      await service.onModuleInit();
      expect(fsPMock.readdir.mock.calls.length).toBe(1);
      expect(fsPMock.mkdir.mock.calls.length).toBe(1);
    });
  });

  describe('exportData()', () => {
    it('should work', async () => {
      const fn = { write: jest.fn(), end: jest.fn() };

      exportService.findAll
        .mockImplementationOnce(() => [{ a: 1 }, { a: 3 }, { a: 2 }])
        .mockImplementationOnce(() => []);
      const writable = new Writable(fn);
      await service.exportData({}, writable, exportService);

      expect(exportService.findAll.mock.calls.length).toBe(2);
      expect(fn.write.mock.calls.length).toBe(1);
      // expect(fn.end.mock.calls.length).toBe(1)
    });
  });
});
