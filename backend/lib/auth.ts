import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface SessionUser {
  sub: string;
  email: string;
  displayName: string;
}

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(user: SessionUser): string {
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "30d" });
}

export function verifyToken(token: string): SessionUser {
  return jwt.verify(token, process.env.JWT_SECRET!) as SessionUser;
}
