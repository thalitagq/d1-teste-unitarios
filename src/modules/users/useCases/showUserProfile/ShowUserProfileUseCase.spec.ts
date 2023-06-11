import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

describe("Show User Profile", () => {
  const usersRepository = new InMemoryUsersRepository()
  const createUsersRepository = new CreateUserUseCase(usersRepository)
  const showProfileUseCase = new ShowUserProfileUseCase(usersRepository)

  it("shold be able to see user profile" , async () => {
    const user = await createUsersRepository.execute({
      name: "User Test 3",
      email: "test@example.com",
      password: "123123"
    })

    const profile = await showProfileUseCase.execute(String(user.id));

    expect(profile).toHaveProperty("id")
  })

  it("shold not be able to see a nonexisting user profile", async () => {

    await expect(showProfileUseCase.execute("123")).rejects.toEqual(
      new ShowUserProfileError()
    );
  });
})