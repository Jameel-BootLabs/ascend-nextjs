import { eq, and } from 'drizzle-orm';
import { 
  db, 
  employeeProgress, 
  trainingModules,
  users,
  type EmployeeProgress,
  type InsertEmployeeProgress
} from '../db';

export async function getUserProgress(userId: string): Promise<EmployeeProgress[]> {
  try {
    return await db.query.employeeProgress.findMany({
      where: eq(employeeProgress.userId, userId),
      with: {
        module: {
          with: {
            section: true,
          },
        },
      },
      orderBy: (progress, { desc }) => [desc(progress.updatedAt)],
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}

export async function getModuleProgress(userId: string, moduleId: number): Promise<EmployeeProgress | null> {
  try {
    const result = await db.query.employeeProgress.findFirst({
      where: and(
        eq(employeeProgress.userId, userId),
        eq(employeeProgress.moduleId, moduleId)
      ),
      with: {
        module: {
          with: {
            section: true,
          },
        },
      },
    });
    return result || null;
  } catch (error) {
    console.error('Error fetching module progress:', error);
    throw error;
  }
}

export async function upsertProgress(progressData: InsertEmployeeProgress): Promise<EmployeeProgress> {
  try {
    // Check if progress already exists
    const existing = await db.query.employeeProgress.findFirst({
      where: and(
        eq(employeeProgress.userId, progressData.userId),
        eq(employeeProgress.moduleId, progressData.moduleId)
      ),
    });

    if (existing) {
      // Update existing progress
      const [updated] = await db.update(employeeProgress)
        .set({ 
          ...progressData, 
          updatedAt: new Date() 
        })
        .where(eq(employeeProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new progress record
      const [created] = await db.insert(employeeProgress)
        .values(progressData)
        .returning();
      return created;
    }
  } catch (error) {
    console.error('Error upserting progress:', error);
    throw error;
  }
}

export async function markModuleCompleted(userId: string, moduleId: number): Promise<EmployeeProgress | null> {
  try {
    const [updated] = await db.update(employeeProgress)
      .set({ 
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(
        eq(employeeProgress.userId, userId),
        eq(employeeProgress.moduleId, moduleId)
      ))
      .returning();
    
    return updated || null;
  } catch (error) {
    console.error('Error marking module as completed:', error);
    throw error;
  }
}

export async function getAllUsersProgress(): Promise<EmployeeProgress[]> {
  try {
    return await db.query.employeeProgress.findMany({
      with: {
        user: true,
        module: {
          with: {
            section: true,
          },
        },
      },
      orderBy: (progress, { desc }) => [desc(progress.updatedAt)],
    });
  } catch (error) {
    console.error('Error fetching all users progress:', error);
    throw error;
  }
}

export async function getUserProgressSummary(userId: string) {
  try {
    const progressList = await getUserProgress(userId);
    
    const summary = {
      totalModules: 0,
      completedModules: 0,
      inProgressModules: 0,
      notStartedModules: 0,
      overallCompletionRate: 0,
    };

    // Get all available modules
    const allModules = await db.query.trainingModules.findMany();
    summary.totalModules = allModules.length;

    // Count progress by status
    progressList.forEach(progress => {
      switch (progress.status) {
        case 'completed':
          summary.completedModules++;
          break;
        case 'in_progress':
          summary.inProgressModules++;
          break;
        case 'not_started':
          summary.notStartedModules++;
          break;
      }
    });

    // Calculate modules not started (modules without progress records)
    const modulesWithProgress = progressList.map(p => p.moduleId);
    const modulesNotStarted = allModules.filter(m => !modulesWithProgress.includes(m.id));
    summary.notStartedModules += modulesNotStarted.length;

    // Calculate overall completion rate
    if (summary.totalModules > 0) {
      summary.overallCompletionRate = Math.round((summary.completedModules / summary.totalModules) * 100);
    }

    return summary;
  } catch (error) {
    console.error('Error getting user progress summary:', error);
    throw error;
  }
}