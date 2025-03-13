// src/repositories/user.repository.ts
import prisma from '../utils/prisma';
import { User } from '@prisma/client';

class UserRepository {
  // Crear usuario
  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'| 'profileImage'>): Promise<User> {
    return prisma.user.create({
      data,
    });
  }


  async findUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }


  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }


  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Obtener los posts que le gustan a un usuario
   */
  async getLikedPosts(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        likedPosts: {
          skip,
          take: limit,
          include: {
            publication: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true
                  }
                },
                _count: {
                  select: {
                    receivedLikes: true,
                    receivedComments: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
  }

  /**
   * Obtener los posts comentados por un usuario
   */
  async getCommentedPosts(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        commentedPosts: {
          skip,
          take: limit,
          include: {
            publication: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true
                  }
                },
                _count: {
                  select: {
                    receivedLikes: true,
                    receivedComments: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
  }
}

export default new UserRepository();
