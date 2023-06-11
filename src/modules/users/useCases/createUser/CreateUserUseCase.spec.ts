import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe("Create User", () => {
  const usersRepositoryInmemory = new InMemoryUsersRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepositoryInmemory);

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "userteste@test.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with an email already in use", async () => {
    await expect(
      createUserUseCase.execute({
        name: "User Test",
        email: "userteste@test.com",
        password: "123456",
      })
    ).rejects.toEqual(new CreateUserError());
  });
});
