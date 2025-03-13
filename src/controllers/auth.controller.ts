import { Request, Response } from "express";
import { printError } from "../utils/logger";
import { AuthService } from "../services";
import UserRepository from "../repositories/user.repository";

class AuthController {
  public async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const profileImage = req.file;

      const result = await AuthService.register(email, password, name, profileImage);
       res.status(result.success ? 201 : 400).json(result);
    } catch (error: any) {
      printError("Error in register controller: " + error);
       res.status(500).json({
        success: false,
        message: "Error registering user",
        data: null,
      });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
       res.status(result.success ? 200 : 401).json(result);
    } catch (error: any) {
      printError("Error in login controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error logging in",
        data: null,
      });
    }
  }

  public async getProfile(req: Request, res: Response) {
    try {
      // El middleware de autenticación ya verificó el token y agregó el id del usuario al request
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
          data: null
        });
      }
      
      const user = await UserRepository.findUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null
        });
      }
      
      // No devolver la contraseña
      const { password, ...userData } = user;
      
      return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: userData
      });
    } catch (error: any) {
      printError("Error in getProfile controller: " + error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving profile",
        data: null
      });
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
          data: null,
        });
        return;
      }

      const { email, password, name } = req.body;
      const profileImage = req.file;

      const result = await AuthService.updateUser(userId, {
        email,
        password,
        name,
        profileImage
      });

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      printError("Error in updateUser controller: " + error);
      res.status(500).json({
        success: false,
        message: "Error updating user",
        data: null,
      });
    }
  }
}

export default new AuthController();
