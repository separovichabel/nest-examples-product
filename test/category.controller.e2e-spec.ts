import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductModule } from '../src/product/product.module';
import { getEntityManagerToken, TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../src/product/entities/category.entity';
import { Product } from '../src/product/entities/product.entity';
import { EntityManager } from 'typeorm';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let manager: EntityManager;

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

  describe('/categories (GET)', () => {
    it('should return a list', () => {
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect('[]');
    });

    it('should return saved categories', async () => {
      const existingCategory1 = await manager.save(Category, {
        name: 'nominho',
      });
      const existingCategory2 = await manager.save(Category, { name: 'nomão' });

      const { body } = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);

      expect(body).toEqual([
        { id: existingCategory1.id, name: existingCategory1.name },
        { id: existingCategory2.id, name: existingCategory2.name },
      ]);
    });
  });

  describe('/categories/:id (GET)', () => {
    it('should return a category', async () => {
      const existingCategory1 = await manager.save(Category, {
        name: 'nominho',
      });

      const { body } = await request(app.getHttpServer())
        .get(`/categories/${existingCategory1.id}`)
        .expect(200);

      expect(body).toEqual({
        id: existingCategory1.id,
        name: existingCategory1.name,
      });
    });

    it('should 404 return when category does not exists', async () => {
      await request(app.getHttpServer()).get(`/categories/123`).expect(404);
    });
  });

  describe('/categories (POST)', () => {
    it('should save category', async () => {
      const cat = { name: 'nomão' };

      const { body } = await request(app.getHttpServer())
        .post(`/categories`)
        .send(cat)
        .expect(201);

      const createdCat = await manager.findOne(Category, { id: body.id });

      expect(body).toEqual({ id: expect.any(Number), name: cat.name });
      expect(createdCat).toBeDefined();
      expect(createdCat.name).toBe(cat.name);
    });
  });

  describe('/categories/:id (PUT)', () => {
    it('should update a category', async () => {
      const categoryOld = await manager.save(Category, { name: 'nomozo' });
      const categoryNew = { name: 'new name' };

      const { body } = await request(app.getHttpServer())
        .put(`/categories/${categoryOld.id}`)
        .send(categoryNew)
        .expect(200);

      const updatedCat = await manager.findOne(Category, { id: body.id });

      expect(body).toEqual({ id: expect.any(Number), name: categoryNew.name });
      expect(updatedCat).toBeDefined();
      expect(updatedCat.name).toBe(categoryNew.name);
    });
  });

  describe('/categories/:id (DELETE)', () => {
    it('should delete category', async () => {
      // Populate
      const category = await manager.save(Category, { name: 'Folder' });

      // Performe Deletion
      const { body } = await request(app.getHttpServer())
        .delete(`/categories/${category.id}`)
        .expect(200);

      const updatedCat = await manager.findOne(Category, { id: body.id });

      expect(updatedCat).toBeUndefined();
      expect(body.name).toEqual(category.name);
    });

    it('should delete category', async () => {
      await request(app.getHttpServer()).delete(`/categories/444`).expect(404);
    });
  });
});
