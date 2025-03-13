import { IUser, IPublication, IComment, ILike } from '../model/interfaces';

// Tipos para crear un usuario
export type UserCreateInput = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;

// Tipos para actualizar un usuario
export type UserUpdateInput = Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>;

// Tipos para crear una publicación
export type PublicationCreateInput = Omit<IPublication, 'id' | 'createdAt' | 'updatedAt'>;

// Tipos para actualizar una publicación
export type PublicationUpdateInput = Partial<Omit<IPublication, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>>;

// Tipos para crear un comentario
export type CommentCreateInput = Omit<IComment, 'id' | 'createdAt' | 'updatedAt'>;

// Tipos para crear un like
export type LikeCreateInput = Omit<ILike, 'createdAt'>; 