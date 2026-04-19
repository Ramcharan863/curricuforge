
import { GoogleGenAI } from "@google/genai";
import { 
  CurriculumParams, 
  LessonPlanParams, 
  AssignmentParams, 
  UpdateParams, 
  InstitutionalParams,
  CollegeAIParams,
  StudentPlanParams,
  StudentPracticeParams,
  StudentInterestCourseParams,
  TimetableParams,
  BloomsParams,
  AppRole
} from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-pro-preview';
const LIGHT_MODEL = 'gemini-3-flash-preview';

async function callWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error.status === 429 || 
                        error.message?.includes('429') || 
                        error.message?.includes('RESOURCE_EXHAUSTED');
    
    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

const SYSTEM_INSTRUCTIONS = `
You are CurricuForge, a Generative AI–powered academic curriculum design and governance system.
Follow Outcome-Based Education (OBE) principles and align learning outcomes to Bloom’s Taxonomy.
Maintain academic rigor and formal university tone. Ensure content is practical, industry-relevant, and teachable.
Assume usage in Indian and global university systems. 
IMPORTANT: All generated content must be specifically branded and contextually relevant to the institution name provided.
`;

const getRoleContext = (role: AppRole, data?: Record<string, string>) => {
  let context = "";
  switch(role) {
    case 'Management':
      context = `Acting as Institutional Management (Designation: ${data?.designation || 'Administrator'}). Focus on standardized frameworks and quality assurance.`;
      break;
    case 'Department':
      context = `Acting as Academic Department (Code: ${data?.dept_code || 'N/A'}). Focus on review, balance, and departmental standards.`;
      break;
    case 'Faculty':
      context = `Acting as Teaching Faculty (Spec: ${data?.specialization || 'General'}). Focus on complete subject depth and pedagogical feasibility.`;
      break;
    case 'Student':
      context = `Acting as Learner (Year: ${data?.year || 'Current'}). Content should be outcome-focused and learner-friendly.`;
      break;
  }
  return context;
};

export const generateCurriculum = async (params: CurriculumParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
Institution: ${params.collegeName}
Department: ${params.department}
User Profile: ${getRoleContext(params.role, params.roleSpecificData)}

Task: Design a complete university-level curriculum for:
- Subject: ${params.subject}
- Academic Level: ${params.level}
- Course Duration: ${params.duration}
- Difficulty Level: ${params.difficulty}

Output must include Course Description, Objectives, Outcomes (Bloom's mapped), Syllabus Breakdown, Pedagogy, Assessment Strategy, 3-5 Sample University Questions, and References.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text;
  });
};

export const generateLessonPlan = async (params: LessonPlanParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
Institution: ${params.collegeName}
User Profile: ${getRoleContext(params.role, params.roleSpecificData)}

Based on the syllabus: ${params.syllabus}
Prerequisites: ${params.prerequisites}

Create week-wise lesson plans including Week/Topic, Objectives, Pedagogy, Activities, and Expected Outcomes.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 2000 } }
    });
    return response.text;
  });
};

export const generateAssignment = async (params: AssignmentParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
Institution: ${params.collegeName}
User Profile: ${getRoleContext(params.role, params.roleSpecificData)}

Task: Generate a formal University Assignment for: ${params.subject}.
Duration: ${params.durationHours}

FORMAT: CLEAN PLAIN TEXT, NO ASTERISKS. 
Structure: Header, Subject Info, Instructions, Section A (MCQs), Section B (Short), Section C (Long). 
Include Bloom's level for each question.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text;
  });
};

// Added mapBlooms service implementation to fix missing export error in BloomsMapper.tsx
export const mapBlooms = async (params: BloomsParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
Institution: ${params.collegeName}
User Profile: ${getRoleContext(params.role, params.roleSpecificData)}

Task: Map the following Learning Outcomes to Bloom's Taxonomy cognitive levels (Remember, Understand, Apply, Analyze, Evaluate, Create).
Outcomes: ${params.outcomes}

Output: A detailed mapping table with Outcome, Bloom's Level, Action Verbs, and Justification.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 2000 } }
    });
    return response.text;
  });
};

export const updateCurriculum = async (params: UpdateParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
Institution: ${params.collegeName}
User Profile: ${getRoleContext(params.role, params.roleSpecificData)}

Existing: ${params.existingCurriculum}
Change Request: ${params.changeRequest}

Update while preserving continuity. Highlight changes.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 3000 } }
    });
    return response.text;
  });
};

export const generateInstitutionalFramework = async (params: InstitutionalParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
Institution: ${params.collegeName}
User Profile: ${getRoleContext(params.role, params.roleSpecificData)}

Generate standardized framework for ${params.institutionType} in ${params.department}.
Include Vision, Mission, PEOs, and OBE mapping.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });
    return response.text;
  });
};

export const generateCollegeAIResponse = async (params: CollegeAIParams) => {
  const prompt = `You are the CurricuForge Strategic Institutional Advisor.
Institution: ${params.collegeName}
Management User: ${params.userName} (${params.roleSpecificData?.designation || 'Admin'})

Context for Analysis: ${params.context}

Management Query: ${params.query}

Task: Provide high-level, strategic AI advice for overall college management. Focus on resource optimization, academic excellence, enrollment strategies, and institutional governance. Use OBE and global academic standards as a baseline. Provide clear, actionable insights in a professional tone.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 3000 } }
    });
    return response.text;
  });
};

export const generateStudentStudyPlan = async (params: StudentPlanParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
User: ${params.userName} (${params.roleSpecificData?.year})
College: ${params.collegeName}
Courses: ${params.currentCourses}
Goals: ${params.goals}

Task: Generate a 4-week student study roadmap.
Break down each week with focus topics, study hours, and specific learning outcomes to achieve.
Keep it student-friendly, encouraging, and clear.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: LIGHT_MODEL,
      contents: prompt
    });
    return response.text;
  });
};

export const generateStudentTimeMgmt = async (params: StudentPlanParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
User: ${params.userName}
Interests/Activities: ${params.goals}
Courses: ${params.currentCourses}

Task: Create a daily balanced schedule for a student to manage academics and co/extracurricular activities.
Ensure time for study, rest, physical activity, and hobbies.
Format as a day-in-the-life guide.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: LIGHT_MODEL,
      contents: prompt
    });
    return response.text;
  });
};

export const generatePracticeQuiz = async (params: StudentPracticeParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
Subject: ${params.subject}
Topic: ${params.topic}
Intensity: ${params.intensity}

Task: Generate a 10-question self-practice quiz.
Include a mix of MCQs and True/False.
Provide the answer key at the very bottom.
Branding: CurricuForge Learner Practice Arena.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: LIGHT_MODEL,
      contents: prompt
    });
    return response.text;
  });
};

export const generatePersonalInterestRoadmap = async (params: StudentInterestCourseParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
User: ${params.userName}
Interest Subject: ${params.interestSubject}
College Hours to EXCLUDE: ${params.collegeHours}
Prior Knowledge: ${params.priorKnowledge}

Task: Act as a personal learning mentor.
1. Generate a modular syllabus (4 units) for the interested subject.
2. Generate a custom learning timetable that ONLY uses hours OUTSIDE of "${params.collegeHours}".
   - Utilize early mornings, late evenings, and weekends.
   - Include specific topics to study in those slots.
Format as a learner-friendly guide with a clear syllabus section and a table for the timetable.
Focus on learning outcomes and practical mastery.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 2000 } }
    });
    return response.text;
  });
};

// Added generateTimetable service
export const generateTimetable = async (params: TimetableParams) => {
  const prompt = `${SYSTEM_INSTRUCTIONS}
Institution: ${params.collegeName}
Department: ${params.department}
User Profile: ${getRoleContext(params.role, params.roleSpecificData)}

Task: Generate a conflict-free academic timetable for the ${params.department} department.
Details:
- Sections: ${params.sections}
- Subjects & Faculty: ${params.subjectsAndFaculty}
- Working Days: ${params.workingDays}
- Periods per Day: ${params.periodsPerDay}

Output must be a structured Markdown table for each section. Ensure no faculty or room overlaps. Use a professional institutional tone.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text;
  });
};