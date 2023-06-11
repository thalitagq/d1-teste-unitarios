import request from "supertest";
import { v4 as uuid } from "uuid";
import { hash } from "bcrypt";
import { Connection } from "typeorm";

import { app } from "../../../../app"
import createConnection from "../../../../shared/typeorm";

let connection: Connection;
describe("Show User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuid();
    const password = await hash("test", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at)
      VALUES('${id}', 'User Testing', 'testing@test.com', '${password}', 'now()')
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("shold be able to list user profile", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "testing@test.com", password: "test" });
    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization:
          "Bearer " + token });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  })

  it("shold not be able to list unauthenticated user profile", async () => {
    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: "Bearer " + "",
      });
    expect(response.status).toBe(401);
  });
})