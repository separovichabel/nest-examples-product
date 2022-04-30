import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private repository: Repository<Category>,
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
    const updateCategory: Category = { id, ...updateCategoryDto }
    return this.repository.save(updateCategory);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
