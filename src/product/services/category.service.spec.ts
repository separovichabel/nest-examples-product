import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { CategoryService } from './category.service';
import { ProductService } from './product.service';

describe('CategoryService', () => {
  let service: CategoryService;
  const jestRepo = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const pService = {
    existsWithCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: ProductService,
          useValue: pService,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: jestRepo,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);

    // Reset every mocked method from repository before each test
    Object.keys(jestRepo).forEach((key) => {
      jestRepo[key].mockReset();
    });
    Object.keys(pService).forEach((key) => {
      pService[key].mockReset();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should have create declared', async () => {
      expect(service.create).toBeDefined();
    });

    it('should call repositorys save correctly', async () => {
      const dto = { name: 'folder' };
      await service.create(dto);
      expect(jestRepo.save.mock.calls.length).toBe(1);
      expect(jestRepo.save.mock.calls[0][0]).toBe(dto);
    });
  });

  describe('findAll()', () => {
    it('should have create declared', async () => {
      expect(service.findAll).toBeDefined();
    });

    it('should find category', async () => {
      const emptyArr = [];
      jestRepo.find.mockReturnValue(emptyArr);
      const createdCategory = await service.findAll();
      expect(jestRepo.find.mock.calls.length).toBe(1);
      expect(createdCategory).toBe(emptyArr);
    });
  });

  describe('findOne()', () => {
    it('should have findOne declared', async () => {
      expect(service.findOne).toBeDefined();
    });

    it('should call findOne from repository correctly', async () => {
      await service.findOne(9);
      expect(jestRepo.findOne.mock.calls.length).toBe(1);
      expect(jestRepo.findOne.mock.calls[0][0]).toBe(9);
    });
  });

  describe('update()', () => {
    it('should have update declared', async () => {
      expect(service.update).toBeDefined();
    });

    it('should call save from repository', async () => {
      await service.update(8, { name: 'tag' });
      expect(jestRepo.save.mock.calls.length).toBe(1);
      expect(jestRepo.save.mock.calls[0][0]).toBeDefined();
    });

    it('should join the id and the dto content before calling save', async () => {
      const dto = { name: 'tag' };
      const id = 8;

      await service.update(id, dto);

      const paramGiven = jestRepo.save.mock.calls[0][0];

      expect(paramGiven.id).toBe(id);
      expect(paramGiven.id).toBeDefined();
      expect(paramGiven.name).toBeDefined();
      expect(paramGiven.name).toBe(dto.name);
    });
  });

  describe('remove()', () => {
    it('should have remove declared', async () => {
      expect(service.remove).toBeDefined();
    });

    it('should return undefined if id not exists', async () => {
      await service.remove(8);
      expect(jestRepo.delete.mock.calls.length).toBe(0);
    });

    it('should return the deleted entity', async () => {
      const entity = { id: 9, name: 'folder' };
      jestRepo.delete.mockReturnValue({ affected: 1 });
      jestRepo.findOne.mockImplementation(async (id) =>
        entity.id === id ? entity : undefined,
      );
      pService.existsWithCategory.mockReturnValue(false);

      const resp = await service.remove(entity.id);
      expect(jestRepo.delete.mock.calls[0][0]).toBe(entity.id);
      expect(resp).toBeDefined();
      expect(resp.id).toBe(entity.id);
    });
    it('should not deleted category user by a product', async () => {
      const entity = { id: 9, name: 'folder' };
      jestRepo.delete.mockReturnValue({ affected: 1 });
      jestRepo.findOne.mockImplementation(async (id) =>
        entity.id === id ? entity : undefined,
      );
      pService.existsWithCategory.mockReturnValue(true);

      expect(service.remove(entity.id)).rejects.toThrow();
    });
  });
});
