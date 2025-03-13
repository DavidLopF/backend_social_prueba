import { IUser } from '../model/interfaces';

// Tipo para usuario con contraseña
export type UserWithPassword = IUser;

// Tipo para usuario sin contraseña (para respuestas)
export type UserResponse = Omit<IUser, 'password'>;

// Tipo para el payload del token JWT
export type JwtPayload = {
  id: number;
  iat?: number;
  exp?: number;
}; 