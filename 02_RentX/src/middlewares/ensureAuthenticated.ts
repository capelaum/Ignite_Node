import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  // Destruct Bearer Token
  const [, token] = authHeader.split(" ");

  try {
    const { sub: userId } = verify(
      token,
      "a9dd3ee39151bda3a1960558e36dea9e"
    ) as IPayload;
    console.log("🚀 ~ userId", userId);

    const usersRepository = new UsersRepository();
    const user = usersRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error("Invalid Token");
  }

  return next();
}
