import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  userId: string;
  avatarFile: string;
}

// Adicionar coluna avatar na tabela users
// Refatorar Entidade User
// Configurar upload multer
// Criar Regra de Negócio para do upload
// Criar Controller
@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ userId, avatarFile }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    user.avatar = avatarFile;

    await this.usersRepository.create(user);
  }
}

export { UpdateUserAvatarUseCase };
