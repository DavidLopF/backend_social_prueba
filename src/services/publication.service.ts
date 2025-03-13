import PublicationRepository from "../repositories/publication.repository";
import { IResponse } from "../model/interfaces";
import { Publication } from "@prisma/client";
import prisma from "../utils/prisma";
import BucketS3 from "../configs/S3.config";


class PublicationService {
    async create(authorId: number, content: string, title: string, imageUrl?: string) {
        return prisma.publication.create({
            data: {
                title,
                content,
                image: imageUrl,
                authorId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true
                    }
                }
            }
        });
    }

    async getAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        return prisma.publication.findMany({
            skip,
            take: limit,
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getById(id: number) {
        return prisma.publication.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true
                    }
                },
                receivedLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true
                            }
                        }
                    }
                },
                receivedComments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        receivedLikes: true,
                        receivedComments: true
                    }
                }
            }
        });
    }

   

    /**
     * Crear una nueva publicación
     */
    async createPublication(
        title: string, 
        content: string, 
        authorId: number,
        image?: Express.Multer.File
    ): Promise<IResponse> {
        try {
            let imageUrl: string | null = null;

            if (image) {
                imageUrl = await BucketS3.uploadPublicationImage(image);
                if (!imageUrl) {
                    return {
                        success: false,
                        message: "Error uploading image",
                        data: null
                    };
                }
            }

            const publication = await PublicationRepository.createPublication({
                title,
                content,
                authorId,
                image: imageUrl
            });

            return {
                success: true,
                message: "Publication created successfully",
                data: publication
            };
        } catch (error) {
            return {
                success: false,
                message: "Error creating publication",
                data: null
            };
        }
    }

    /**
     * Obtener todas las publicaciones
     */
    async getAllPublications(page: number = 1, limit: number = 10): Promise<IResponse> {
        try {
            const [publications, total] = await Promise.all([
                PublicationRepository.getAllPublications(page, limit),
                prisma.publication.count()
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                message: "Publications retrieved successfully",
                data: publications,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            return {
                success: false,
                message: "Error retrieving publications",
                data: null
            };
        }
    }

    /**
     * Obtener una publicación por ID
     */
    async getPublicationById(id: number): Promise<IResponse> {
        try {
            const publication = await PublicationRepository.getPublicationById(id);

            if (!publication) {
                return {
                    success: false,
                    message: "Publication not found",
                    data: null
                };
            }

            return {
                success: true,
                message: "Publication retrieved successfully",
                data: publication
            };
        } catch (error) {
            return {
                success: false,
                message: "Error retrieving publication",
                data: null
            };
        }
    }

    /**
     * Actualizar una publicación
     */
    async updatePublication(id: number, data: Partial<Publication>, userId: number): Promise<IResponse> {
        try {
            // Verificar que la publicación exista
            const publication = await PublicationRepository.getPublicationById(id);

            if (!publication) {
                return {
                    success: false,
                    message: "Publication not found",
                    data: null
                };
            }

            // Verificar que el usuario sea el autor de la publicación
            if (publication.authorId !== userId) {
                return {
                    success: false,
                    message: "You are not authorized to update this publication",
                    data: null
                };
            }

            const updatedPublication = await PublicationRepository.updatePublication(id, data);

            return {
                success: true,
                message: "Publication updated successfully",
                data: updatedPublication
            };
        } catch (error) {
            return {
                success: false,
                message: "Error updating publication",
                data: null
            };
        }
    }

    /**
     * Eliminar una publicación
     */
    async deletePublication(id: number, userId: number): Promise<IResponse> {
        try {
            const publication = await PublicationRepository.getPublicationById(id);

            if (!publication) {
                return {
                    success: false,
                    message: "Publication not found",
                    data: null
                };
            }

            if (publication.authorId !== userId) {
                return {
                    success: false,
                    message: "You are not authorized to delete this publication",
                    data: null
                };
            }

            if (publication.image) {
                await BucketS3.deletePublicationImage(publication.image);
            }

            await PublicationRepository.deletePublication(id);

            return {
                success: true,
                message: "Publication deleted successfully",
                data: null
            };
        } catch (error) {
            return {
                success: false,
                message: "Error deleting publication",
                data: null
            };
        }
    }

    /**
     * Obtener publicaciones de un usuario
     */
    async getPublicationsByUserId(userId: number, page: number = 1, limit: number = 10): Promise<IResponse> {
        try {
            const [publications, total] = await Promise.all([
                PublicationRepository.getPublicationsByUserId(userId, page, limit),
                prisma.publication.count({
                    where: { authorId: userId }
                })
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                message: "Publications retrieved successfully",
                data: publications,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            return {
                success: false,
                message: "Error retrieving publications",
                data: null
            };
        }
    }

    /**
     * Agregar un comentario a una publicación
     */
    async addComment(publicationId: number, userId: number, content: string): Promise<IResponse> {
        try {
            const publication = await PublicationRepository.getPublicationById(publicationId);

            if (!publication) {
                return {
                    success: false,
                    message: "Publication not found",
                    data: null
                };
            }

            const comment = await prisma.comment.create({
                data: {
                    content,
                    userId,
                    publicationId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true
                        }
                    }
                }
            });

            return {
                success: true,
                message: "Comment added successfully",
                data: comment
            };
        } catch (error) {
            return {
                success: false,
                message: "Error adding comment",
                data: null
            };
        }
    }

    /**
     * Obtener comentarios de una publicación
     */
    async getPublicationComments(publicationId: number, page: number = 1, limit: number = 10): Promise<IResponse> {
        try {
            const skip = (page - 1) * limit;
            const [comments, total] = await Promise.all([
                prisma.comment.findMany({
                    where: { publicationId },
                    skip,
                    take: limit,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }),
                prisma.comment.count({
                    where: { publicationId }
                })
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                message: "Comments retrieved successfully",
                data: comments,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            return {
                success: false,
                message: "Error retrieving comments",
                data: null
            };
        }
    }

    /**
     * Dar/quitar like a una publicación
     */
    async toggleLike(publicationId: number, userId: number): Promise<IResponse> {
        try {
            const publication = await PublicationRepository.getPublicationById(publicationId);

            if (!publication) {
                return {
                    success: false,
                    message: "Publication not found",
                    data: null
                };
            }

            const existingLike = await prisma.like.findUnique({
                where: {
                    userId_publicationId: {
                        userId,
                        publicationId
                    }
                }
            });

            if (existingLike) {
                await prisma.like.delete({
                    where: {
                        userId_publicationId: {
                            userId,
                            publicationId
                        }
                    }
                });

                return {
                    success: true,
                    message: "Like removed successfully",
                    data: { liked: false }
                };
            }

            await prisma.like.create({
                data: {
                    userId,
                    publicationId
                }
            });

            return {
                success: true,
                message: "Like added successfully",
                data: { liked: true }
            };
        } catch (error) {
            return {
                success: false,
                message: "Error toggling like",
                data: null
            };
        }
    }

    /**
     * Obtener likes de una publicación
     */
    async getPublicationLikes(publicationId: number, page: number = 1, limit: number = 10): Promise<IResponse> {
        try {
            const skip = (page - 1) * limit;
            const [likes, total] = await Promise.all([
                prisma.like.findMany({
                    where: { publicationId },
                    skip,
                    take: limit,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }),
                prisma.like.count({
                    where: { publicationId }
                })
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                message: "Likes retrieved successfully",
                data: likes,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            return {
                success: false,
                message: "Error retrieving likes",
                data: null
            };
        }
    }
}

export default new PublicationService(); 