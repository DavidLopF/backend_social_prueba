//libreira para encriptar la contraseña
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository";
import { IResponse, IUser } from "../model/interfaces";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import BucketS3 from "../configs/S3.config";


class AuthService {
  public async login(email: string, password: string): Promise<IResponse> {
    try {
      const user = await UserRepository.findUserByEmail(email);
      
      if (!user) {
        return {
          success: false,
          message: "Invalid credentials",
          data: null
        };
      }
    
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid credentials",
          data: null
        };
      }
    
      const token = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );
      
      return {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            profileImage: user.profileImage
          },
          token
        }
      };
    } catch (error) {
      return {
        success: false,
        message: "Error in login service",
        data: null
      };
    }
  }

  public async register(
    email: string, 
    password: string, 
    name: string,
    profileImage?: Express.Multer.File
  ): Promise<IResponse> {
    try {
      let imageUrl: string | null = null;

      if (profileImage) {
        imageUrl = await BucketS3.uploadPublicationImage(profileImage);
        if (!imageUrl) {
          return {
            success: false,
            message: "Error uploading profile image",
            data: null
          };
        }
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);

      const user: IUser = {
        email,
        password: hashedPassword,
        name,
        profileImage: imageUrl
      };

      const result = await UserRepository.createUser(user);

      const token = jwt.sign(
        { id: result.id }, 
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );
      
      return {
        success: true,
        message: "User created successfully",
        data: { 
          user: {
            id: result.id,
            email: result.email,
            name: result.name,
            profileImage: result.profileImage
          }, 
          token 
        }
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return {
          success: false,
          message: "Email already in use",
          data: null
        };
      }
      return {
        success: false,
        message: "Error in register service",
        data: null
      };
    }
  }

  public async updateUser(
    userId: number,
    data: {
      name?: string;
      email?: string;
      password?: string;
      profileImage?: Express.Multer.File;
    }
  ): Promise<IResponse> {
    try {
      const user = await UserRepository.findUserById(userId);
      
      if (!user) {
        return {
          success: false,
          message: "User not found",
          data: null
        };
      }

      const updateData: any = { ...data };
      delete updateData.profileImage;

      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      if (data.profileImage) {
        // Si el usuario ya tiene una imagen, la eliminamos
        if (user.profileImage) {
          await BucketS3.deletePublicationImage(user.profileImage);
        }

        const imageUrl = await BucketS3.uploadPublicationImage(data.profileImage);
        if (!imageUrl) {
          return {
            success: false,
            message: "Error uploading profile image",
            data: null
          };
        }
        updateData.profileImage = imageUrl;
      }

      const updatedUser = await UserRepository.updateUser(userId, updateData);

      return {
        success: true,
        message: "User updated successfully",
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          profileImage: updatedUser.profileImage
        }
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        return {
          success: false,
          message: "Email already in use",
          data: null
        };
      }
      return {
        success: false,
        message: "Error updating user",
        data: null
      };
    }
  }
}

export default new AuthService();
