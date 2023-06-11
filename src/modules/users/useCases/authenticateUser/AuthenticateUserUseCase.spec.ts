import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

describe("Authenticate User",() => {
  const usersRepository = new InMemoryUsersRepository()
  const createUserUseCase = new CreateUserUseCase(usersRepository)
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)

  it("shoud be able to authenticate existing user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test2",
      email: "usertest2@test.com",
      password: "123131"
    })

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: '123131',
    });

    expect(userAuthenticated).toHaveProperty("token")
  });

  it("shoud not be able to authenticate nonexisting user", async () => {
    await expect(authenticateUserUseCase.execute({
      email: "someuser@test.com",
      password: "123131",
    })).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("shoud not be able to authenticate user with wrong password", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "usertest2@test.com",
        password: "123531",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("shoud not be able to authenticate user with wrong email", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "usertest3@test.com",
        password: "123131",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

})