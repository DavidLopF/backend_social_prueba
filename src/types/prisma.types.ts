import { IUser, IPublication, IComment, ILike } from '../model/interfaces';

export type UserCreateInput = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;


export type UserUpdateInput = Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>;

export type PublicationCreateInput = Omit<IPublication, 'id' | 'createdAt' | 'updatedAt'>;

export type PublicationUpdateInput = Partial<Omit<IPublication, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>>;


export type CommentCreateInput = Omit<IComment, 'id' | 'createdAt' | 'updatedAt'>;

export type LikeCreateInput = Omit<ILike, 'createdAt'>; 