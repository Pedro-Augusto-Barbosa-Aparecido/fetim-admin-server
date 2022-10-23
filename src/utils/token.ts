import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function generateToken(info: any, expiresIn: number) {
  return await jwt.sign(info, process.env.SECRET_KEY_JWT || "", {
    expiresIn, // 3 days
  });
}
