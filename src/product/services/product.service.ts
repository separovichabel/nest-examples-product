import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../entities/product.entity';
import { CategoryService } from './category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,

    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );

    if (category) {
      return this.repository.save(createProductDto);
    }

    throw new HttpException(
      `categoryId ${createProductDto.categoryId} must exists`,
      422,
    );
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.repository.findOne(id);

    if (!product) {
      return;
    }

    const category = await this.categoryService.findOne(
      updateProductDto.categoryId,
    );

    if (category) {
      return this.repository.save({ id, ...category });
    }

    throw new HttpException(
      `categoryId ${updateProductDto.categoryId} must exists`,
      422,
    );
  }

  async remove(id: number) {
    const product = await this.repository.findOne(id);

    if (product) {
      return this.repository.remove(product);
    }

    return;
  }
}
