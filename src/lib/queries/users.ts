import { eq } from 'drizzle-orm';
import { db, users, type User } from '../db';

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return result || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return result || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

export async function createUser(userData: {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role?: 'admin' | 'employee';
}): Promise<User> {
  try {
    const [user] = await db.insert(users).values({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      role: userData.role || 'employee',
    }).returning();
    
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: 'admin' | 'employee'): Promise<User | null> {
  try {
    const [user] = await db.update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    return user || null;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    return await db.query.users.findMany({
      orderBy: (users, { asc }) => [asc(users.createdAt)],
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}