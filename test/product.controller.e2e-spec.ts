import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductModule } from '../src/product/product.module';
import { getEntityManagerToken, TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../src/product/entities/category.entity';
import { Product } from '../src/product/entities/product.entity';
import { EntityManager } from 'typeorm';
import { UpdateProductDto } from 'src/product/dtos/update-product.dto';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let manager: EntityManager;
  let category: Category;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProductModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db.sql',
          entities: [Category, Product],
          synchronize: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    manager = await module.get(getEntityManagerToken());
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await manager.query(`DELETE FROM product;`);
    await manager.query(`DELETE FROM category;`);
  });

  describe('/products (GET)', () => {
    it('should return a list', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect('[]');
    });

    it('should return saved products', async () => {
      category = await manager.save(Category, { name: 'categoria' });
      const product = await manager.save(Product, {
        name: 'nominho',
        categoryId: category.id,
      });

      const { body } = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      const firstEl = body[0];

      expect(firstEl).toBeDefined();
      expect(product.id).toBe(product.id);
      expect(product.name).toBe(product.name);
      expect(product.categoryId).toBe(product.categoryId);
    });

    it('should limit products returned', async () => {
      category = await manager.save(Category, { name: 'categoria' });
      const category2 = await manager.save(Category, { name: 'categoria' });
      await manager.save(Product, [
        { name: 'nominho', categoryId: category.id },
        { name: 'nomoso', categoryId: category2.id },
      ]);

      const { body } = await request(app.getHttpServer())
        .get('/products')
        .query({ limit: 1 })
        .expect(200);

      expect(body).toBeDefined();
      expect(body.length).toBe(1);
    });

    it('should Bad request for wrong query', async () => {
      category = await manager.save(Category, { name: 'categoria' });
      const category2 = await manager.save(Category, { name: 'categoria' });
      await manager.save(Product, [
        { name: 'nominho', categoryId: category.id },
        { name: 'nomoso', categoryId: category2.id },
      ]);

      const { body } = await request(app.getHttpServer())
        .get('/products')
        .query({ limit: -1 })
        .expect(400);

      expect(body).toBeDefined();
    });
  });

  describe('/products/:id (GET)', () => {
    it('should return a product', async () => {
      category = await manager.save(Category, { name: 'categoria' });
      const product = await manager.save(Product, {
        name: 'nominho',
        categoryId: category.id,
      });

      const { body } = await request(app.getHttpServer())
        .get(`/products/${product.id}`)
        .expect(200);

      expect(body).toEqual({
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
      });
    });

    it('should 404 return when product does not exists', async () => {
      await request(app.getHttpServer()).get(`/products/123`).expect(404);
    });
  });

  describe('/products (POST)', () => {
    it('should save product', async () => {
      category = await manager.save(Category, { name: 'categoria' });
      const product: UpdateProductDto = {
        name: 'nomão',
        categoryId: category.id,
      };

      const { body } = await request(app.getHttpServer())
        .post(`/products`)
        .send(product)
        .expect(201);

      const createdCat = await manager.findOne(Product, { id: body.id });

      expect(body).toBeDefined();
      expect(body.name).toBe(product.name);
      expect(createdCat).toBeDefined();
      expect(createdCat.name).toBe(product.name);
    });
  });

  describe('/products/:id (PUT)', () => {
    it('should update a product', async () => {
      // setting Up Data
      category = await manager.save(Category, { name: 'categoria' });
      const productOld = await manager.save(Product, {
        name: 'nomozo',
        categoryId: category.id,
      });
      const productNew = { name: 'new name', categoryId: category.id };

      // Evoking http
      const { body } = await request(app.getHttpServer())
        .put(`/products/${productOld.id}`)
        .send(productNew)
        .expect(200);

      const updatedCat = await manager.findOne(Product, { id: body.id });

      // checking returned Body
      expect(body.id).toBe(productOld.id);
      expect(body.name).toBe(productNew.name);
      expect(body.categoryId).toBe(productNew.categoryId);

      expect(updatedCat).toBeDefined();
      expect(updatedCat.name).toBe(productNew.name);
    });
  });

  describe('/products/:id (DELETE)', () => {
    it('should delete product', async () => {
      category = await manager.save(Category, { name: 'categoria' });
      // Populate
      const product = await manager.save(Product, {
        name: 'Folder',
        categoryId: category.id,
      });

      // Performe Deletion
      const { body } = await request(app.getHttpServer())
        .delete(`/products/${product.id}`)
        .expect(200);

      const updatedCat = await manager.findOne(Product, { id: body.id });

      expect(updatedCat).toBeUndefined();
      expect(body.name).toEqual(product.name);
    });

    it('should delete product', async () => {
      await request(app.getHttpServer()).delete(`/products/444`).expect(404);
    });
  });
});
