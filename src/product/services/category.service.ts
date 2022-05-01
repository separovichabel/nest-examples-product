import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { Category } from '../entities/category.entity';
import { ProductService } from './product.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private repository: Repository<Category>,

    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.repository.save(createCategoryDto);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const updateCategory: Category = { id, ...updateCategoryDto };
    return this.repository.save(updateCategory);
  }

  async remove(id: number) {
    const category = await this.repository.findOne(id);

    if (!category) {
      return;
    }
    
    const categoryIsUsed: boolean = await this.productService.existsWithCategory(id) 

    if (categoryIsUsed) {
      throw new HttpException(`Category ${id} should not be used by products to be deleted`, 409)
    }

    const deleteResp = await this.repository.delete(id);

    if (!!deleteResp.affected) {
      return category
    }

    throw new HttpException('Nothing was deleted', 500)
  }
}
