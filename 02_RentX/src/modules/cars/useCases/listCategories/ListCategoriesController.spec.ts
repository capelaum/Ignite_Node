import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { randomUUID } from "crypto";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = randomUUID();
    const password = await hash("admin2", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license )
        values('${id}', 'admin2', 'admin2@rentx.com.br', '${password}', true, 'now()', 'XXXXXX')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all categories ", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin2@rentx.com.br",
      password: "admin2",
    });

    const { token } = responseToken.body;
    console.log("🚀 ~ token", token);

    await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest 3",
        description: "Category Supertest 3",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toEqual("Category Supertest 3");
  });
});
