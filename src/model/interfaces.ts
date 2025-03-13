// Interfaz para la respuesta estándar de la API
export interface IResponse {
  success: boolean;
  message: string;
  data: any;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Interfaz para el usuario
export interface IUser {
  id?: number;
  email: string;
  password: string;
  name: string;
  profileImage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz para la publicación
export interface IPublication {
  id?: number;
  title: string;
  content: string;
  image?: string | null;
  authorId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz para el comentario
export interface IComment {
  id?: number;
  content: string;
  userId: number;
  publicationId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz para el like
export interface ILike {
  userId: number;
  publicationId: number;
  createdAt?: Date;
} 