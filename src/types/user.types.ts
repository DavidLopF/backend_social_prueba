import { IUser } from '../model/interfaces';


export type UserWithPassword = IUser;

export type UserResponse = Omit<IUser, 'password'>;


export type JwtPayload = {
  id: number;
  iat?: number;
  exp?: number;
}; 