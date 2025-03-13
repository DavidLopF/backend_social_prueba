import { Router } from "express";
import { check } from 'express-validator';
import { PublicationController } from "../controllers";
import { ValidateParams, AuthMiddleware } from "../middlewares";
import upload from "../middlewares/upload.middleware";

const router = Router();

/**
 * @swagger
 * /publications:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     tags: [Publications]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de items por página
 *     responses:
 *       200:
 *         description: Lista de publicaciones con paginación
 */
router.get('/', PublicationController.getAllPublications);

/**
 * @swagger
 * /publications/{id}:
 *   get:
 *     summary: Obtener una publicación por ID
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación encontrada
 *       404:
 *         description: Publicación no encontrada
 */
router.get('/:id', PublicationController.getPublicationById);

/**
 * @swagger
 * /publications:
 *   post:
 *     summary: Crear una nueva publicación
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 */
router.post('/', [
  AuthMiddleware.validateToken,
  upload.single("image"),
  check('title').isString().isLength({ min: 3, max: 100 }),
  check('content').isString().isLength({ min: 3 }),
  ValidateParams.validate,
], PublicationController.createPublication);

/**
 * @swagger
 * /publications/{id}:
 *   put:
 *     summary: Actualizar una publicación
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente
 *       403:
 *         description: No autorizado para actualizar esta publicación
 */
router.put('/:id', [
  AuthMiddleware.validateToken,
  check('title').optional().isString().isLength({ min: 3, max: 100 }),
  check('content').optional().isString().isLength({ min: 3 }),
  ValidateParams.validate,
], PublicationController.updatePublication);

/**
 * @swagger
 * /publications/{id}:
 *   delete:
 *     summary: Eliminar una publicación
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Publicación eliminada exitosamente
 *       403:
 *         description: No autorizado para eliminar esta publicación
 */
router.delete('/:id', AuthMiddleware.validateToken, PublicationController.deletePublication);

/**
 * @swagger
 * /publications/user/{userId}:
 *   get:
 *     summary: Obtener publicaciones de un usuario
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de publicaciones del usuario
 */
router.get('/user/:userId', PublicationController.getPublicationsByUserId);

/**
 * @swagger
 * /publications/{id}/comments:
 *   post:
 *     summary: Add a comment to a publication
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post('/:id/comments', [
    AuthMiddleware.validateToken,
    check('content').notEmpty(),
    ValidateParams.validate
], PublicationController.addComment);

/**
 * @swagger
 * /publications/{id}/comments:
 *   get:
 *     summary: Get comments of a publication
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 */
router.get('/:id/comments', PublicationController.getPublicationComments);

/**
 * @swagger
 * /publications/{id}/like:
 *   post:
 *     summary: Toggle like on a publication
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Like toggled successfully
 */
router.post('/:id/like', [
    AuthMiddleware.validateToken,
    ValidateParams.validate
], PublicationController.toggleLike);

/**
 * @swagger
 * /publications/{id}/likes:
 *   get:
 *     summary: Get likes of a publication
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Likes retrieved successfully
 */
router.get('/:id/likes', PublicationController.getPublicationLikes);

export default router;
