import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { QueryProductDto } from '../dtos/query-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../entities/product.entity';
import { CategoryService } from './category.service';
import { ExportServiceInterface } from './ExportService.interface';

@Injectable()
export class ProductService
  implements ExportServiceInterface<CreateProductDto>
{
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

  queryProductToFindOption(query?: QueryProductDto) {
    const findOption: FindManyOptions<Product> = {
      take: 10,
    };

    if (query && query.limit) {
      findOption.take = query.limit;
    }

    if (query && query.page) {
      findOption.skip = (query.page - 1) * findOption.take;
    }

    if (query && query.categoryId) {
      findOption.where = { categoryId: query.categoryId };
    }

    return findOption;
  }

  findAll(query?: QueryProductDto) {
    const findOption = this.queryProductToFindOption(query);
    return this.repository.find(findOption);
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async existsWithCategory(categoryId: number): Promise<boolean> {
    return !!(await this.repository.findOne({ categoryId }));
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
      return this.repository.save({ id, ...updateProductDto });
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
