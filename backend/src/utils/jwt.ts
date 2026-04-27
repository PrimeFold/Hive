
import jwt, { Secret } from 'jsonwebtoken'

export interface JwtPayload {
  id: string;
}

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET as Secret) as JwtPayload
  } catch {
    return null
  }
}

