import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { AppError } from "@shared/errors/AppError";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokenRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokenRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<NextFunction | AppError | void> {
  const authHeader = req.headers.authorization;
  const usersTokenRepository = new UsersTokenRepository();

  // Destruct Bearer Token
  const [, token] = authHeader.split(" ");

  if (!authHeader || !token) {
    throw new AppError("Token not provided", 401);
  }

  try {
    const { sub: user_id } = verify(
      token,
      auth.secret_refresh_token
    ) as IPayload;

    const user = await usersTokenRepository.findByUserIdAndRefreshToken(
      user_id,
      token
    );

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = {
      id: user_id,
    };

    return next();
  } catch (error) {
    throw new AppError("Invalid Token", 401);
  }
}
