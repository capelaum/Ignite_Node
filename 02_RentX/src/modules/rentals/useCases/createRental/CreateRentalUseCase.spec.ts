import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;

describe("Create Rental", () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
  });

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: "1212121",
      expected_return_date: new Date(),
    });
    console.log("🚀 ~ rental", rental);

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental related to an user with an open rent in progress", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "1212121",
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "623129",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental related to a car already rented", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "123",
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: "54321",
        car_id: "123",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
