import { Request, Response } from "express";
import { printError } from "../utils/logger";
import PublicationService from "../services/publication.service";

class PublicationController {
  /**
   * Crear una nueva publicación
   */
  async createPublication(req: Request, res: Response) {
    try {
      const { title, content } = req.body;
      const userId = req.user?.id;
      const image = req.file;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
          data: null,
        });
        return;
      }

      const result = await PublicationService.createPublication(
        title,
        content,
        userId,
        image
      );
      res.status(result.success ? 201 : 400).json(result);
    } catch (error: any) {
      printError("Error in createPublication controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error creating publication",
        data: null,
      });
    }
  }

  /**
   * Obtener todas las publicaciones
   */
  async getAllPublications(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await PublicationService.getAllPublications(page, limit);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error: any) {
      printError("Error in getAllPublications controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error retrieving publications",
        data: null,
      });
    }
  }

  /**
   * Obtener una publicación por ID
   */
  async getPublicationById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid publication ID",
          data: null,
        });
        return;
      }

      const result = await PublicationService.getPublicationById(id);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error: any) {
      printError("Error in getPublicationById controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error retrieving publication",
        data: null,
      });
    }
  }

  /**
   * Actualizar una publicación
   */
  async updatePublication(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { title, content } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
          data: null,
        });
        return;
      }

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid publication ID",
          data: null,
        });
        return;
      }

      const result = await PublicationService.updatePublication(
        id,
        { title, content },
        userId
      );
      res.status(
        result.success
          ? 200
          : result.message === "Publication not found"
          ? 404
          : 403
      ).json(result);
    } catch (error: any) {
      printError("Error in updatePublication controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error updating publication",
        data: null,
      });
    }
  }

  /**
   * Eliminar una publicación
   */
  async deletePublication(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
          data: null,
        });
        return;
      }

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid publication ID",
          data: null,
        });
        return;
      }

      const result = await PublicationService.deletePublication(id, userId);
      res.status(
        result.success
          ? 200
          : result.message === "Publication not found"
          ? 404
          : 403
      ).json(result);
    } catch (error: any) {
      printError("Error in deletePublication controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error deleting publication",
        data: null,
      });
    }
  }

  /**
   * Obtener publicaciones de un usuario
   */
  async getPublicationsByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
          data: null,
        });
        return;
      }

      const result = await PublicationService.getPublicationsByUserId(
        userId,
        page,
        limit
      );
      res.status(result.success ? 200 : 400).json(result);
    } catch (error: any) {
      printError("Error in getPublicationsByUserId controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error retrieving publications",
        data: null,
      });
    }
  }

  /**
   * Agregar un comentario a una publicación
   */
  public async addComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      if (typeof userId !== 'number') {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
          data: null
        });
        return;
      }

      const response = await PublicationService.addComment(
        parseInt(id),
        userId,
        content
      );
      res.status(201).json(response);
    } catch (error) {
      printError("Error in addComment controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error adding comment",
        data: null
      });
    }
  }

  /**
   * Obtener comentarios de una publicación
   */
  public async getPublicationComments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const response = await PublicationService.getPublicationComments(
        parseInt(id),
        page,
        limit
      );

      res.status(200).json(response);
    } catch (error) {
      printError("Error in getPublicationComments controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error retrieving comments",
        data: null
      });
    }
  }

  /**
   * Dar/quitar like a una publicación
   */
  async toggleLike(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (typeof userId !== 'number') {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
          data: null
        });
        return;
      }

      const response = await PublicationService.toggleLike(
        parseInt(id),
        userId
      );
      res.status(200).json(response);
    } catch (error) {
      printError("Error in toggleLike controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error toggling like",
        data: null
      });
    }
  }

  /**
   * Obtener likes de una publicación
   */
  async getPublicationLikes(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const response = await PublicationService.getPublicationLikes(
        parseInt(id),
        page,
        limit
      );

      res.status(200).json(response);
    } catch (error) {
      printError("Error in getPublicationLikes controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error retrieving likes",
        data: null
      });
    }
  }
}

export default new PublicationController();
