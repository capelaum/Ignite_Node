import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<NextFunction | AppError | void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token not provided", 401);
  }

  // Destruct Bearer Token
  const [, token] = authHeader.split(" ");

  try {
    const { sub: userId } = verify(
      token,
      "a9dd3ee39151bda3a1960558e36dea9e"
    ) as IPayload;

    const usersRepository = new UsersRepository();
    const user = usersRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = {
      id: userId,
    };

    return next();
  } catch (error) {
    throw new AppError("Invalid Token", 401);
  }
}
