import { eq, and, desc } from 'drizzle-orm';
import { 
  db, 
  assessmentQuestions, 
  assessmentResults,
  type AssessmentQuestion,
  type AssessmentResult,
  type InsertAssessmentQuestion,
  type InsertAssessmentResult
} from '../db';

// Assessment Questions
export async function getAssessmentQuestionsBySection(sectionId: number): Promise<AssessmentQuestion[]> {
  try {
    return await db.query.assessmentQuestions.findMany({
      where: eq(assessmentQuestions.sectionId, sectionId),
      orderBy: (questions, { asc }) => [asc(questions.order)],
    });
  } catch (error) {
    console.error('Error fetching assessment questions by section:', error);
    throw error;
  }
}

export async function getAssessmentQuestionsByModule(moduleId: number): Promise<AssessmentQuestion[]> {
  try {
    return await db.query.assessmentQuestions.findMany({
      where: eq(assessmentQuestions.moduleId, moduleId),
      orderBy: (questions, { asc }) => [asc(questions.order)],
    });
  } catch (error) {
    console.error('Error fetching assessment questions by module:', error);
    throw error;
  }
}

export async function createAssessmentQuestion(questionData: InsertAssessmentQuestion): Promise<AssessmentQuestion> {
  try {
    const [question] = await db.insert(assessmentQuestions)
      .values(questionData)
      .returning();
    return question;
  } catch (error) {
    console.error('Error creating assessment question:', error);
    throw error;
  }
}

export async function updateAssessmentQuestion(id: number, questionData: Partial<InsertAssessmentQuestion>): Promise<AssessmentQuestion | null> {
  try {
    const [question] = await db.update(assessmentQuestions)
      .set(questionData)
      .where(eq(assessmentQuestions.id, id))
      .returning();
    return question || null;
  } catch (error) {
    console.error('Error updating assessment question:', error);
    throw error;
  }
}

export async function deleteAssessmentQuestion(id: number): Promise<void> {
  try {
    await db.delete(assessmentQuestions)
      .where(eq(assessmentQuestions.id, id));
  } catch (error) {
    console.error('Error deleting assessment question:', error);
    throw error;
  }
}

// Assessment Results
export async function getUserAssessmentResults(userId: string): Promise<AssessmentResult[]> {
  try {
    return await db.query.assessmentResults.findMany({
      where: eq(assessmentResults.userId, userId),
      orderBy: [desc(assessmentResults.dateTaken)],
    });
  } catch (error) {
    console.error('Error fetching user assessment results:', error);
    throw error;
  }
}

export async function getAssessmentResult(id: number): Promise<AssessmentResult | null> {
  try {
    const result = await db.query.assessmentResults.findFirst({
      where: eq(assessmentResults.id, id),
    });
    return result || null;
  } catch (error) {
    console.error('Error fetching assessment result:', error);
    throw error;
  }
}

export async function createAssessmentResult(resultData: InsertAssessmentResult): Promise<AssessmentResult> {
  try {
    const [result] = await db.insert(assessmentResults)
      .values(resultData)
      .returning();
    return result;
  } catch (error) {
    console.error('Error creating assessment result:', error);
    throw error;
  }
}

export async function updateAssessmentResult(id: number, resultData: Partial<InsertAssessmentResult>): Promise<AssessmentResult | null> {
  try {
    const [result] = await db.update(assessmentResults)
      .set(resultData)
      .where(eq(assessmentResults.id, id))
      .returning();
    return result || null;
  } catch (error) {
    console.error('Error updating assessment result:', error);
    throw error;
  }
}

export async function getAllAssessmentResults(): Promise<AssessmentResult[]> {
  try {
    return await db.query.assessmentResults.findMany({
      orderBy: [desc(assessmentResults.dateTaken)],
    });
  } catch (error) {
    console.error('Error fetching all assessment results:', error);
    throw error;
  }
}

export async function deleteUserAssessmentResults(userId: string): Promise<void> {
  try {
    await db.delete(assessmentResults)
      .where(eq(assessmentResults.userId, userId));
  } catch (error) {
    console.error('Error deleting user assessment results:', error);
    throw error;
  }
}

export async function getUserAssessmentResultBySection(userId: string, sectionId: number): Promise<AssessmentResult | null> {
  try {
    const result = await db.query.assessmentResults.findFirst({
      where: and(
        eq(assessmentResults.userId, userId),
        eq(assessmentResults.sectionId, sectionId)
      ),
      orderBy: [desc(assessmentResults.dateTaken)],
    });
    return result || null;
  } catch (error) {
    console.error('Error fetching user assessment result by section:', error);
    throw error;
  }
}

export async function calculateAssessmentScore(
  sectionId: number, 
  userAnswers: Record<string, string>
): Promise<{
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
}> {
  try {
    const questions = await getAssessmentQuestionsBySection(sectionId);
    
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    questions.forEach(question => {
      const userAnswer = userAnswers[question.id.toString()];
      const correctAnswerIndex = question.correctAnswer; // This is 'a', 'b', 'c', 'd'
      const options = question.options as string[];
      
      // Map letter to index for backwards compatibility
      const letterToIndex: { [key: string]: number } = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
      const correctAnswerAsIndex = letterToIndex[correctAnswerIndex] ?? 0;
      const correctAnswerText = options[correctAnswerAsIndex];
      
      // Check if user answer matches either the letter, index, or text
      if (userAnswer === correctAnswerIndex || 
          userAnswer === correctAnswerAsIndex.toString() || 
          userAnswer === correctAnswerText) {
        correctAnswers++;
      }
    });
    
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const passed = score >= 80; // 80% passing grade
    
    return {
      score,
      totalQuestions,
      correctAnswers,
      passed
    };
  } catch (error) {
    console.error('Error calculating assessment score:', error);
    throw error;
  }
}