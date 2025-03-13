import { UserRepository } from '../repositories/user.repository';
import { UserCreateInput, UserUpdateInput } from '../types/prisma.types';
import { UserResponse, UserWithPassword } from '../types/user.types';
import bcrypt from 'bcrypt';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data: UserCreateInput): Promise<UserWithPassword> {
        return this.userRepository.create({
            ...data,
            password: await bcrypt.hash(data.password, 10)
        });
    }

    async findByEmail(email: string): Promise<UserWithPassword | null> {
        return this.userRepository.findByEmail(email);
    }

    async findById(id: string): Promise<UserWithPassword | null> {
        return this.userRepository.findById(id);
    }

    async update(id: string, data: UserUpdateInput): Promise<UserWithPassword> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return this.userRepository.update(id, data);
    }

    // Método auxiliar para convertir a UserResponse (sin contraseña)
    toUserResponse(user: UserWithPassword): UserResponse {
        const { password, ...userResponse } = user;
        return userResponse;
    }
} 