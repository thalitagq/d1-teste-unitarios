import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceError } from "./GetBalanceError";

describe("Get Balance Use Case", () => {
  const usersRepository = new InMemoryUsersRepository()
  const statmentsRepository = new InMemoryStatementsRepository()
  const createUserUseCase = new CreateUserUseCase(usersRepository)
  const getBalanceUseCase = new GetBalanceUseCase(statmentsRepository, usersRepository)
  
  it("shold be able to get user balance" , async () => {  
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "userteste@test.com",
      password: "123456",
    });
    
    const userBalance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(userBalance).toHaveProperty("balance")
  })

  it("shold not be able to get a nonexisting user balance", async () => {
    await expect(getBalanceUseCase.execute({ user_id: "someid" })).rejects.toEqual(
      new GetBalanceError()
    );
  });
})