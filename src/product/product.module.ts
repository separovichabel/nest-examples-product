import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './controllers/category.controller';
import { ProductController } from './controllers/product.controller';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { NotFoundInterceptor } from './interceptors/notFound.interceptor';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, CategoryService, NotFoundInterceptor],
  exports: [ProductService]
})
export class ProductModule {}
