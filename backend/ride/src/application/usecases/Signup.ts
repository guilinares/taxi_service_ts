import AccountRepository from "../repository/AccountRepository";
import Logger from "../logger/Logger";
import Account from "../../domain/Account";

export default class Signup {
    accountDAO: AccountRepository;
    logger: Logger;

    constructor(accountDAO: AccountRepository, logger: Logger) {
        this.accountDAO = accountDAO;
        this.logger = logger;
    }

    async execute(input: Input): Promise<Output> {
        this.logger.log(`signup ${input.name}`);
        const existingAccount = await this.accountDAO.getByEmail(input.email);
        if (existingAccount) throw new Error("Duplicated account");
        const account = Account.create(input.name, input.email, input.cpf, input.carPlate || "", !!input.isPassenger, !!input.isDriver);
        await this.accountDAO.save(account);
        return {
            accountId: account.accountId
        };
    }
}

type Input = {
    name: string,
    email: string,
    cpf: string,
    carPlate?: string,
    isPassenger?: boolean,
    isDriver?: boolean,
    password: string
}

type Output = {
    accountId: string
}