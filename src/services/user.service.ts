import UserRepository from '../repositories/user.repository';
import { IUser, IResponse } from '../model/interfaces';
import bcrypt from 'bcrypt';

class UserService {
    async findById(id: number): Promise<IUser | null> {
        return UserRepository.findUserById(id);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return UserRepository.findUserByEmail(email);
    }

    async create(data: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return UserRepository.createUser({
            ...data,
            password: hashedPassword
        });
    }

    async update(id: number, data: Partial<IUser>): Promise<IUser> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return UserRepository.updateUser(id, data);
    }

    // Método auxiliar para convertir a respuesta sin contraseña
    toUserResponse(user: IUser): Omit<IUser, 'password'> {
        const { password, ...userResponse } = user;
        return userResponse;
    }
}

export default new UserService(); 