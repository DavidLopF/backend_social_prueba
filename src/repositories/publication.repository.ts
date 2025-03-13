import prisma from '../utils/prisma';
import { Publication } from '@prisma/client';

class PublicationRepository {
  // Crear publicación
  async createPublication(data: Omit<Publication, 'id' | 'createdAt' | 'updatedAt'>): Promise<Publication> {
    return prisma.publication.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        }
      }
    });
  }

  // Obtener publicación por ID
  async getPublicationById(id: number): Promise<Publication | null> {
    return prisma.publication.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        },
        receivedLikes: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        receivedComments: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }

  // Obtener todas las publicaciones
  async getAllPublications(page: number = 1, limit: number = 10): Promise<Publication[]> {
    const skip = (page - 1) * limit;
    
    return prisma.publication.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        },
        receivedLikes: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        receivedComments: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }

  // Actualizar publicación
  async updatePublication(id: number, data: Partial<Publication>): Promise<Publication> {
    return prisma.publication.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        }
      }
    });
  }

  // Eliminar publicación
  async deletePublication(id: number): Promise<Publication> {
    await prisma.$transaction([
      prisma.like.deleteMany({
        where: { publicationId: id }
      }),
      prisma.comment.deleteMany({
        where: { publicationId: id }
      })
    ]);

    return prisma.publication.delete({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        }
      }
    });
  }

  // Obtener publicaciones de un usuario
  async getPublicationsByUserId(userId: number, page: number = 1, limit: number = 10): Promise<Publication[]> {
    const skip = (page - 1) * limit;
    
    return prisma.publication.findMany({
      where: {
        authorId: userId
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        },
        receivedLikes: true,
        receivedComments: true
      }
    });
  }
}

export default new PublicationRepository(); 