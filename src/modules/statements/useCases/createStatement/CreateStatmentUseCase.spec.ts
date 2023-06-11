import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement Use Case", () => {
  const usersRepository = new InMemoryUsersRepository();
  const statmentsRepository = new InMemoryStatementsRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepository);
  const createStatmentUseCase = new CreateStatementUseCase(usersRepository, statmentsRepository)

  it("shold be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "userteste@test.com",
      password: "123456",
    });

    const statement = await createStatmentUseCase.execute({
      amount: 32,
      description: "Test statement",
      type: OperationType.DEPOSIT,
      user_id: user.id,
    });

    expect(statement).toHaveProperty("id");
  });

  it("shold not be able to create a new statement from a nonexisting user", async () => {
    await expect(
      createStatmentUseCase.execute({
        amount: 32,
        description: "Test statement",
        type: OperationType.DEPOSIT,
        user_id: "someid",
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("shold not be able to create a new withdraw statement if balance is insufficient", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test 34",
      email: "userteste34@test.com",
      password: "123456",
    });

    await createStatmentUseCase.execute({
      amount: 32,
      description: "Test statement",
      type: OperationType.DEPOSIT,
      user_id: user.id,
    });

    await expect(
      createStatmentUseCase.execute({
      amount: 35,
      description: "Test statement withdraw",
      type: OperationType.WITHDRAW,
      user_id: user.id,
    })).rejects.toEqual(new CreateStatementError.InsufficientFunds())

  });
});
