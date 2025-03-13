import PublicationService from '../services/publication.service';
import PublicationRepository from '../repositories/publication.repository';
import BucketS3 from '../configs/S3.config';
import prisma from '../utils/prisma';

// Mock de las dependencias
jest.mock('../repositories/publication.repository');
jest.mock('../configs/S3.config');
jest.mock('../utils/prisma', () => ({
  publication: {
    count: jest.fn()
  }
}));

describe('PublicationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPublications', () => {
    it('debería devolver publicaciones paginadas', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const publications = [
        { id: 1, title: 'Test 1' },
        { id: 2, title: 'Test 2' }
      ];
      const total = 20;

      (PublicationRepository.getAllPublications as jest.Mock).mockResolvedValue(publications);
      (prisma.publication.count as jest.Mock).mockResolvedValue(total);

      // Act
      const result = await PublicationService.getAllPublications(page, limit);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(publications);
      expect(result.pagination).toEqual({
        total,
        page,
        limit,
        totalPages: 2,
        hasNextPage: true,
        hasPrevPage: false
      });
    });
  });

  describe('createPublication', () => {
    it('debería crear una publicación sin imagen', async () => {
      // Arrange
      const title = 'Test Publication';
      const content = 'Test Content';
      const authorId = 1;
      const publication = {
        id: 1,
        title,
        content,
        authorId,
        image: null
      };

      (PublicationRepository.createPublication as jest.Mock).mockResolvedValue(publication);

      // Act
      const result = await PublicationService.createPublication(title, content, authorId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Publication created successfully');
      expect(result.data).toEqual(publication);
    });

    it('debería manejar error al subir imagen', async () => {
      // Arrange
      const title = 'Test Publication';
      const content = 'Test Content';
      const authorId = 1;
      const image = {} as Express.Multer.File;

      (BucketS3.uploadPublicationImage as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await PublicationService.createPublication(title, content, authorId, image);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error uploading image');
      expect(result.data).toBeNull();
    });
  });

  describe('getPublicationsByUserId', () => {
    it('debería devolver publicaciones de un usuario paginadas', async () => {
      // Arrange
      const userId = 1;
      const page = 1;
      const limit = 10;
      const publications = [
        { id: 1, title: 'Test 1', authorId: userId },
        { id: 2, title: 'Test 2', authorId: userId }
      ];
      const total = 15;

      (PublicationRepository.getPublicationsByUserId as jest.Mock).mockResolvedValue(publications);
      (prisma.publication.count as jest.Mock).mockResolvedValue(total);

      // Act
      const result = await PublicationService.getPublicationsByUserId(userId, page, limit);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(publications);
      expect(result.pagination).toEqual({
        total,
        page,
        limit,
        totalPages: 2,
        hasNextPage: true,
        hasPrevPage: false
      });
    });
  });

  describe('deletePublication', () => {
    it('debería eliminar una publicación del autor', async () => {
      // Arrange
      const publicationId = 1;
      const userId = 1;
      const publication = {
        id: publicationId,
        authorId: userId,
        image: 'test.jpg'
      };

      (PublicationRepository.getPublicationById as jest.Mock).mockResolvedValue(publication);

      // Act
      const result = await PublicationService.deletePublication(publicationId, userId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Publication deleted successfully');
      expect(BucketS3.deletePublicationImage).toHaveBeenCalledWith('test.jpg');
      expect(PublicationRepository.deletePublication).toHaveBeenCalledWith(publicationId);
    });

    it('debería rechazar eliminación de publicación de otro autor', async () => {
      // Arrange
      const publicationId = 1;
      const userId = 1;
      const publication = {
        id: publicationId,
        authorId: 2, // Diferente usuario
        image: 'test.jpg'
      };

      (PublicationRepository.getPublicationById as jest.Mock).mockResolvedValue(publication);

      // Act
      const result = await PublicationService.deletePublication(publicationId, userId);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('You are not authorized to delete this publication');
      expect(BucketS3.deletePublicationImage).not.toHaveBeenCalled();
      expect(PublicationRepository.deletePublication).not.toHaveBeenCalled();
    });
  });
}); 