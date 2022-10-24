import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function generateToken(info: any, expiresIn: number) {
  return await jwt.sign(info, process.env.SECRET_KEY_JWT || "", {
    expiresIn, // 3 days
  });
}

export async function getUserIdByToken(token: string): Promise<string> {
  // @ts-ignore
  const { id } = await jwt.verify(token, process.env.SECRET_KEY_JWT || "");

  return id;
}
