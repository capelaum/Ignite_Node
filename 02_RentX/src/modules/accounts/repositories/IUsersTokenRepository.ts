import { ICreteUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UsersToken } from "../infra/typeorm/entities/UsersToken";

interface IUsersTokenRepository {
  create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreteUserTokenDTO): Promise<UsersToken>;
}

export { IUsersTokenRepository };
