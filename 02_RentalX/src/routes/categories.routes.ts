import { Router } from "express";
import { randomUUID } from "crypto";
import { Category } from "../model/Category";

const categoriesRoutes = Router();

const categories: Category[] = [];

categoriesRoutes.post("/", (req, res) => {
  const { name, description } = req.body;
  const newCategory = new Category();

  Object.assign(newCategory, {
    name,
    description,
    created_at: new Date(),
  });

  categories.push(newCategory);
  return res.status(201).send(newCategory);
});

export { categoriesRoutes };
