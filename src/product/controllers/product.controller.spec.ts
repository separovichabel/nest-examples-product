import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Product } from '../entities/product.entity';
import { ProductService } from '../services/product.service';
import { ProductController } from './product.controller';

describe('ProductController', () => {
  let controller: ProductController;
  let prodServMock = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: prodServMock,
        },
      ],
    }).compile();

    controller = module.get(ProductController);
    prodServMock = module.get(ProductService);

    Object.keys(prodServMock).forEach((key) => {
      prodServMock[key].mockReset();
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call service create', async () => {
      const dto: CreateProductDto = { name: '', categoryId: 1 };
      const prdct: Product = { id: 2, name: '', categoryId: 1 };

      let paramGiven;
      prodServMock.create.mockImplementation(async (param) => {
        paramGiven = param;
        return prdct;
      });

      expect(await controller.create(dto)).toBe(prdct);
      expect(paramGiven).toBe(dto);
    });
  });

  describe('findAll()', () => {
    it('should call service findAll', async () => {
      const prdct: Product[] = [{ id: 2, name: '', categoryId: 1 }];
      prodServMock.findAll.mockImplementation(async () => prdct);

      const resp = await controller.findAll();
      expect(resp).toBeDefined();
      expect(resp[0]).toBe(prdct[0]);
    });
  });

  describe('findOne()', () => {
    it('should call service findOne', async () => {
      const prdct: Product = { id: 2, name: '', categoryId: 1 };
      prodServMock.findOne.mockImplementation(async () => prdct);

      const resp = await controller.findOne(prdct.id.toString());
      expect(resp).toBeDefined();
      expect(resp[0]).toBe(prdct[0]);
      expect(prodServMock.findOne.mock.calls[0][0]).toBe(prdct.id);
    });
  });
});
