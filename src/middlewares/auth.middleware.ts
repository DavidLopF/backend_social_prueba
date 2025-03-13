import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { printError } from "../utils/logger";

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}

class AuthMiddleware {
  /**
   * Middleware para validar el token JWT
   */
  validateToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Obtener el token del header Authorization
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
         res.status(401).json({
          success: false,
          message: "No token provided",
          data: null
        });
      }
      
      const parts = authHeader?.split(" ");
      
      if (parts?.length !== 2) {
         res.status(401).json({
          success: false,
          message: "Token error",
          data: null
        });
      }
      
      const [scheme, token] = parts || [];
      
      if (!/^Bearer$/i.test(scheme)) {
         res.status(401).json({
          success: false,
          message: "Token malformatted",
          data: null
        });
      }
      
      jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
        if (err) {
           res.status(401).json({
            success: false,
            message: "Invalid token",
            data: null
          });
        }
        
        // Guardar el id del usuario en el request para uso posterior
        req.user = { id: (decoded as any).id };
        
         next();
      });
    } catch (error) {
      printError("Error validating token: " + error);
       res.status(500).json({
        success: false,
        message: "Error validating token",
        data: null
      });
    }
  }
}

export default new AuthMiddleware(); 