import { getRepository, Repository } from "typeorm";

import { ICreteUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { UsersToken } from "../entities/UsersToken";

class UsersTokenRepository implements IUsersTokenRepository {
  private repository: Repository<UsersToken>;

  constructor() {
    this.repository = getRepository(UsersToken);
  }

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreteUserTokenDTO): Promise<UsersToken> {
    const userToken = this.repository.create({
      user_id,
      expires_date,
      refresh_token,
    });

    await this.repository.save(userToken);

    return userToken;
  }
}

export { UsersTokenRepository };
