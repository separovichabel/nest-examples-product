import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './product/entities/category.entity';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'product',
      entities: [Category, Product],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}
