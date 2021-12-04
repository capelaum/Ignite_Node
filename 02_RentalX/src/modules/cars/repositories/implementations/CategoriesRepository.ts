import { Category } from "../../entities/Category";
import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from "../ICategoriesRepository";

import { getRepository, Repository } from "typeorm";

class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  private static INSTANCE: CategoriesRepository;

  private constructor() {
    this.repository = getRepository(Category);
  }

  public static getInstance(): CategoriesRepository {
    if (!CategoriesRepository.INSTANCE) {
      CategoriesRepository.INSTANCE = new CategoriesRepository();
    }

    return CategoriesRepository.INSTANCE;
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const newCategory = this.repository.create({
      name,
      description,
    });

    await this.repository.save(newCategory);
  }

  async list(): Promise<Category[]> {
    const categories = await this.repository.find();
    return categories;
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.repository.findOne({
      where: { name },
    });

    return category;
  }
}

export { CategoriesRepository };
