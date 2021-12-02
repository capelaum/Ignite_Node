import { Request, Response } from "express";
import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

class ListCategoriesController {
  constructor(private listCategoriesUsecase: ListCategoriesUseCase) {}

  handle(req: Request, res: Response): Response {
    const allCategories = this.listCategoriesUsecase.execute();

    return res.json(allCategories);
  }
}

export { ListCategoriesController };
