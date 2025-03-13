import { Router } from "express";
import { check } from 'express-validator';
import { AuthController } from "../controllers";
import { ValidateParams, AuthMiddleware } from "../middlewares";
import upload from "../middlewares/upload.middleware";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
router.post('/register', [
    upload.single('profileImage'),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('name').isLength({ min: 3 }),
    ValidateParams.validate,
], AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 */
router.post('/login', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    ValidateParams.validate,
], AuthController.login);

/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Actualizar perfil de usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 */
router.put('/update', [
    AuthMiddleware.validateToken,
    upload.single('profileImage'),
    check('email').optional().isEmail(),
    check('password').optional().isLength({ min: 6 }),
    check('name').optional().isLength({ min: 3 }),
    ValidateParams.validate,
], AuthController.updateUser);

export default router;  
