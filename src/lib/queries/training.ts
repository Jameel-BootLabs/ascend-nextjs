import { eq, asc, desc } from 'drizzle-orm';
import { 
  db, 
  trainingSections, 
  trainingModules, 
  modulePages,
  type TrainingSection,
  type TrainingModule,
  type ModulePage,
  type InsertTrainingSection,
  type InsertTrainingModule,
  type InsertModulePage
} from '../db';

// Training Sections
export async function getAllSections(): Promise<TrainingSection[]> {
  try {
    return await db.query.trainingSections.findMany({
      orderBy: [asc(trainingSections.order)],
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
}

export async function getSectionById(id: number): Promise<TrainingSection | null> {
  try {
    const result = await db.query.trainingSections.findFirst({
      where: eq(trainingSections.id, id),
    });
    return result || null;
  } catch (error) {
    console.error('Error fetching section by ID:', error);
    throw error;
  }
}

export async function createSection(sectionData: InsertTrainingSection): Promise<TrainingSection> {
  try {
    const [section] = await db.insert(trainingSections)
      .values(sectionData)
      .returning();
    return section;
  } catch (error) {
    console.error('Error creating section:', error);
    throw error;
  }
}

export async function updateSection(id: number, sectionData: Partial<InsertTrainingSection>): Promise<TrainingSection | null> {
  try {
    const [section] = await db.update(trainingSections)
      .set({ ...sectionData, updatedAt: new Date() })
      .where(eq(trainingSections.id, id))
      .returning();
    return section || null;
  } catch (error) {
    console.error('Error updating section:', error);
    throw error;
  }
}

export async function deleteSection(id: number): Promise<void> {
  try {
    await db.delete(trainingSections)
      .where(eq(trainingSections.id, id));
  } catch (error) {
    console.error('Error deleting section:', error);
    throw error;
  }
}

// Training Modules
export async function getAllModules(): Promise<TrainingModule[]> {
  try {
    return await db.query.trainingModules.findMany({
      orderBy: [asc(trainingModules.order)],
      with: {
        section: true,
      },
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
}

export async function getModulesBySection(sectionId: number): Promise<TrainingModule[]> {
  try {
    return await db.query.trainingModules.findMany({
      where: eq(trainingModules.sectionId, sectionId),
      orderBy: [asc(trainingModules.order)],
    });
  } catch (error) {
    console.error('Error fetching modules by section:', error);
    throw error;
  }
}

export async function getModuleById(id: number): Promise<TrainingModule | null> {
  try {
    const result = await db.query.trainingModules.findFirst({
      where: eq(trainingModules.id, id),
      with: {
        section: true,
        pages: {
          orderBy: [asc(modulePages.pageOrder)],
        },
      },
    });
    return result || null;
  } catch (error) {
    console.error('Error fetching module by ID:', error);
    throw error;
  }
}

export async function createModule(moduleData: InsertTrainingModule): Promise<TrainingModule> {
  try {
    const [module] = await db.insert(trainingModules)
      .values(moduleData)
      .returning();
    return module;
  } catch (error) {
    console.error('Error creating module:', error);
    throw error;
  }
}

export async function updateModule(id: number, moduleData: Partial<InsertTrainingModule>): Promise<TrainingModule | null> {
  try {
    const [module] = await db.update(trainingModules)
      .set({ ...moduleData, updatedAt: new Date() })
      .where(eq(trainingModules.id, id))
      .returning();
    return module || null;
  } catch (error) {
    console.error('Error updating module:', error);
    throw error;
  }
}

export async function deleteModule(id: number): Promise<void> {
  try {
    await db.delete(trainingModules)
      .where(eq(trainingModules.id, id));
  } catch (error) {
    console.error('Error deleting module:', error);
    throw error;
  }
}

// Module Pages
export async function getModulePages(moduleId: number): Promise<ModulePage[]> {
  try {
    return await db.query.modulePages.findMany({
      where: eq(modulePages.moduleId, moduleId),
      orderBy: [asc(modulePages.pageOrder)],
    });
  } catch (error) {
    console.error('Error fetching module pages:', error);
    throw error;
  }
}

export async function createModulePage(pageData: InsertModulePage): Promise<ModulePage> {
  try {
    const [page] = await db.insert(modulePages)
      .values(pageData)
      .returning();
    return page;
  } catch (error) {
    console.error('Error creating module page:', error);
    throw error;
  }
}

export async function updateModulePage(id: number, pageData: Partial<InsertModulePage>): Promise<ModulePage | null> {
  try {
    const [page] = await db.update(modulePages)
      .set({ ...pageData, updatedAt: new Date() })
      .where(eq(modulePages.id, id))
      .returning();
    return page || null;
  } catch (error) {
    console.error('Error updating module page:', error);
    throw error;
  }
}

export async function deleteModulePage(id: number): Promise<void> {
  try {
    await db.delete(modulePages)
      .where(eq(modulePages.id, id));
  } catch (error) {
    console.error('Error deleting module page:', error);
    throw error;
  }
}