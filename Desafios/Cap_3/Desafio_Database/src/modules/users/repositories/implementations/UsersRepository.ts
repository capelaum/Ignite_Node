import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    // Complete usando ORM
    const user = await this.repository.findOneOrFail(user_id, {
      relations: ["games"],
    });
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    // Complete usando raw query
    return this.repository.query(`
      SELECT * FROM users
      ORDER BY first_name ASC;
    `);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    // Complete usando raw query
    const formated_first_name = first_name.toUpperCase().trim();
    const formated_last_name = last_name.toUpperCase().trim();

    return this.repository.query(`
      SELECT * FROM users
      WHERE
        UPPER(first_name) = '${formated_first_name}'
      AND
        UPPER(last_name) = '${formated_last_name}'
    `);
  }
}
