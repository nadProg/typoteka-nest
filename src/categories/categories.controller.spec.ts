import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import type { Category } from './entities/category';
import type { CreateCategoryDto } from './dto/create-category.dto';

type MockModule<M> = Record<keyof M, jest.Mock>;

describe('CategoriesController', () => {
  const categoriesMockServiceValue = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } satisfies Partial<
    MockModule<CategoriesService>
  > as MockModule<CategoriesService>;

  let categoriesController: CategoriesController;
  let categoriesMockService: MockModule<CategoriesService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: categoriesMockServiceValue,
        },
      ],
    }).compile();

    categoriesController = module.get(CategoriesController);
    categoriesMockService =
      module.get<MockModule<CategoriesService>>(CategoriesService);
  });

  describe('controller instance', () => {
    it('should be defined', () => {
      expect(categoriesController).toBeDefined();
    });
  });

  describe('findAll method', () => {
    it('should return categories found by the repository', () => {
      const mockCategories: Category[] = [];
      categoriesMockService.findAll.mockReturnValue(mockCategories);

      expect(categoriesController.findAll()).resolves.toEqual(mockCategories);
    });
  });

  describe('create method', () => {
    it('should return category created by the repository', () => {
      const mockCategory = {};
      const createCategoryDto = {} as CreateCategoryDto;
      categoriesMockService.create.mockReturnValue(mockCategory);

      expect(categoriesController.create(createCategoryDto)).resolves.toEqual(
        mockCategory,
      );
    });
  });

  describe('update method', () => {
    it('should return category successfully updated by the repository', () => {
      const mockCategory = {};
      const mockCategoryId = 1;
      const updateCategoryDto = {} as CreateCategoryDto;
      categoriesMockService.update.mockReturnValue(mockCategory);

      expect(
        categoriesController.update(mockCategoryId, updateCategoryDto),
      ).resolves.toEqual(mockCategory);
    });

    it('should throws an error when the repository returns nothing', () => {
      const mockCategoryId = 1;
      const updateCategoryDto = {} as CreateCategoryDto;
      categoriesMockService.update.mockReturnValue(null);

      expect(
        categoriesController.update(mockCategoryId, updateCategoryDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete method', () => {
    it('should return nothing when the repository successfully deletes', () => {
      const mockCategoryId = 1;
      categoriesMockService.delete.mockReturnValue(true);

      expect(
        categoriesController.delete(mockCategoryId),
      ).resolves.not.toBeDefined();
    });

    it('should throws an error when the repository deletion fails', () => {
      const mockCategoryId = 1;
      categoriesMockService.delete.mockReturnValue(false);

      expect(categoriesController.delete(mockCategoryId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
