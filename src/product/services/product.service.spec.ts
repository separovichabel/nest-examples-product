import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../entities/product.entity';
import { CategoryService } from './category.service';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  const jestRepo = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const catServiceMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CategoryService,
          useValue: catServiceMock,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: jestRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    // Reset every mocked method from repository before each test
    Object.keys(jestRepo).forEach((key) => {
      jestRepo[key].mockReset();
    });

    Object.keys(catServiceMock).forEach((key) => {
      catServiceMock[key].mockReset();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should have create method declared', async () => {
      expect(service.create).toBeDefined();
    });

    it('should create product', async () => {
      const dto: CreateProductDto = { name: 'folder', categoryId: 1 };
      jestRepo.save.mockImplementation((data) => ({ id: 1, ...data }));
      catServiceMock.findOne.mockImplementation(() => ({ id: 1 }));

      const resp: Product = await service.create(dto);
      expect(resp).toBeDefined();
      expect(resp.name).toBe(dto.name);
      expect(resp.categoryId).toBe(dto.categoryId);
    });

    it('should throw error when categoryId does not exists', async () => {
      const dto: CreateProductDto = { name: 'folder', categoryId: 1 };
      jestRepo.save.mockImplementation((data) => ({ id: 1, ...data }));

      expect(service.create(dto)).rejects.toThrowError();
    });
  });

  describe('findAll()', () => {
    it('should be declared', async () => {
      expect(service.findAll).toBeDefined();
    });

    it('should find products from repository', async () => {
      const content = [{ id: 1 }];
      jestRepo.find.mockImplementation(() => content);

      const resp: Product[] = await service.findAll();
      expect(resp).toBeDefined();
      expect(resp).toBe(content);
    });
  });

  describe('findOne()', () => {
    it('should be declared', async () => {
      expect(service.findOne).toBeDefined();
    });

    it('should find a product from repository', async () => {
      const id = 55;
      const content = { id };
      jestRepo.findOne.mockImplementation(() => content);

      const resp: Product = await service.findOne(id);
      expect(resp).toBeDefined();
      expect(resp).toBe(content);
      expect(jestRepo.findOne.mock.calls[0][0]).toBe(id);
    });
  });

  describe('update()', () => {
    const id = 55;
    const categoryId = 3;
    const content: UpdateProductDto = { name: 'nome', categoryId };

    it('should be declared', async () => {
      expect(service.update).toBeDefined();
    });

    it('should update a product', async () => {
      jestRepo.save.mockImplementation(async () => ({ id, ...content }));
      jestRepo.findOne.mockImplementation(async (idd) => ({
        id: idd,
        ...content,
      }));
      catServiceMock.findOne.mockImplementation(async (idd) => ({ id: idd }));

      const resp: Product = await service.update(id, content);

      // Testing final Value
      expect(resp).toBeDefined();
      expect(resp.id).toBe(id);
      expect(resp.name).toBe(content.name);
      expect(resp.categoryId).toBe(content.categoryId);
    });

    it('should throw error when product contains a non existing categoryId', async () => {
      catServiceMock.findOne.mockImplementation(() => undefined);
      jestRepo.findOne.mockImplementation(async (idd) => ({
        id: idd,
        ...content,
      }));
      expect(service.update(id, content)).rejects.toThrowError();
    });

    it('should return undefined if product does not exists', async () => {
      jestRepo.findOne.mockImplementation(() => undefined);
      expect(await service.update(id, content)).toBeUndefined();
    });
  });
  describe('remove()', () => {
    const id = 44;
    const content: UpdateProductDto = { name: 'nome', categoryId: 98 };
    it('should delete from repository', async () => {
      jestRepo.findOne.mockImplementation(() => content);
      jestRepo.remove.mockImplementation((data) => data);

      const response = await service.remove(id);

      expect(response).toBeDefined();
      expect(jestRepo.findOne.mock.calls[0][0]).toBe(id);
    });

    it('should return undefine if not exists', async () => {
      jestRepo.findOne.mockImplementation(() => undefined);
      expect(await service.remove(id)).toBeUndefined();
      expect(jestRepo.findOne.mock.calls[0][0]).toBe(id);
    });
  });
});
