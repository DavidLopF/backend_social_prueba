import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import { success, printError } from '../utils/logger';

const users = [
  {
    email: 'admin@example.com',
    password: '123456',
    name: 'Administrator',
    profileImage: 'https://ui-avatars.com/api/?name=Administrator'
  },
  {
    email: 'user@example.com',
    password: '123456',
    name: 'Normal User',
    profileImage: 'https://ui-avatars.com/api/?name=Normal+User'
  }
];

export async function seedUsers() {
  try {
    // Check if seeder was already executed
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@example.com' }
    });

    if (adminUser) {
      success('Seeders were already executed');
      return;
    }

    // If admin doesn't exist, execute seeders
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.create({
        data: {
          ...user,
          password: hashedPassword
        }
      });
      success(`User created: ${user.email}`);
    }
  } catch (error) {
    printError('Error in user seeder: ' + error);
  }
} 