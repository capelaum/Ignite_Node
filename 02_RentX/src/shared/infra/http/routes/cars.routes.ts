import { CreateCarConroller } from "@modules/cars/useCases/createCar/CreateCarController";
import { Router } from "express";

const carsRoutes = Router();

const createCarController = new CreateCarConroller();

carsRoutes.post("/", createCarController.handle);

export { carsRoutes };
