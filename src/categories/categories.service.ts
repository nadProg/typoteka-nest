import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    const category = await this.categoriesRepository.preload({ id });

    if (!category) {
      return null;
    }

    return (
      (await this.categoriesRepository.save({
        ...category,
        ...updateCategoryDto,
      })) ?? null
    );
  }

  async delete(id: number): Promise<boolean> {
    return !!(await this.categoriesRepository.delete(id)).affected;
  }
}
