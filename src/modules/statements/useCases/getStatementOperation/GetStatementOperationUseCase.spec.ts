import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement Operation", () => {
  const usersRepository = new InMemoryUsersRepository();
  const statmentsRepository = new InMemoryStatementsRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepository);
  const createStatmentUseCase = new CreateStatementUseCase(
    usersRepository,
    statmentsRepository
  );
  const getStatementOperation = new GetStatementOperationUseCase(usersRepository, statmentsRepository)

  it("shold be able to retrieve a statement operetaion", async () => {
    const user = await createUserUseCase.execute({
      name: "Matilda McLaughlin",
      email: "ka@anajofvol.hm",
      password: "123456",
    });

    const statementCreated = await createStatmentUseCase.execute({
      amount: 32,
      description: "Test statement",
      type: OperationType.DEPOSIT,
      user_id: user.id,
    });

    const statment = await getStatementOperation.execute({user_id: user.id, statement_id: statementCreated.id})

    expect(statment).toEqual({
      amount: 32,
      description: "Test statement",
      type: OperationType.DEPOSIT,
      user_id: user.id,
      id: statementCreated.id
    });
  });

   it("shold not be able to retrieve a nonexisting statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Theresa Drake",
      email: "ebapi@senjoj.af",
      password: "123456",
    });

     await expect(
       getStatementOperation.execute({
         user_id: user.id,
         statement_id: "someid",
       })
     ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
   });

});
