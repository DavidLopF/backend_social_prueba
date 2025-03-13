import AuthService from '../services/auth.service';
import UserRepository from '../repositories/user.repository';
import BucketS3 from '../configs/S3.config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock de las dependencias
jest.mock('../repositories/user.repository');
jest.mock('../configs/S3.config');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería devolver error cuando el email no existe', async () => {
      // Arrange
      const email = 'test@test.com';
      const password = '123456';
      (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await AuthService.login(email, password);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
      expect(result.data).toBeNull();
    });

    it('debería devolver error cuando la contraseña es incorrecta', async () => {
      // Arrange
      const email = 'test@test.com';
      const password = '123456';
      (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email,
        password: 'hashedPassword'
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await AuthService.login(email, password);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
      expect(result.data).toBeNull();
    });

    it('debería devolver token cuando las credenciales son correctas', async () => {
      // Arrange
      const email = 'test@test.com';
      const password = '123456';
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        name: 'Test User',
        profileImage: 'image.jpg'
      };
      (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      // Act
      const result = await AuthService.login(email, password);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Login successful');
      expect(result.data).toHaveProperty('token');
      expect(result.data.user).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage
      });
    });
  });

  describe('register', () => {
    it('debería registrar un usuario sin imagen de perfil', async () => {
      // Arrange
      const email = 'test@test.com';
      const password = '123456';
      const name = 'Test User';
      const hashedPassword = 'hashedPassword';
      const user = {
        id: 1,
        email,
        password: hashedPassword,
        name,
        profileImage: undefined
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (UserRepository.createUser as jest.Mock).mockResolvedValue(user);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      // Act
      const result = await AuthService.register(email, password, name);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('User created successfully');
      expect(result.data).toHaveProperty('token');
      expect(result.data.user).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage
      });
    });

    it('debería manejar error de email duplicado', async () => {
      // Arrange
      const email = 'test@test.com';
      const password = '123456';
      const name = 'Test User';
      
      (UserRepository.createUser as jest.Mock).mockRejectedValue({ code: 'P2002' });

      // Act
      const result = await AuthService.register(email, password, name);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Email already in use');
      expect(result.data).toBeNull();
    });
  });
}); 