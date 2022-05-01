import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
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
    const updateCategory: Category = { id, ...updateCategoryDto };
    return this.repository.save(updateCategory);
  }

  async remove(id: number) {
    const category = await this.repository.findOne(id);

    if (category) {
      return this.repository.remove(category);
    }

    return;
  }
}
