
import type { ProgressStep } from './types';

export const GRADE_LEVELS: string[] = [
    'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'
];

export const PROMPT_TEMPLATES = {
    LESSON_PLAN: `You are an expert curriculum designer. Generate a lesson plan aligned to these standards: [{standards}].
Grade Level: {grade}.
Previously covered content: {priorLearning}.
Focus for this lesson: {focus}.
Provide: objective, materials, step-by-step procedures, checks for understanding, and a closure/exit ticket idea. Keep it concise and classroom-ready. Respond in a valid JSON format with the following keys: "objective", "materials", "procedure", "checks", "closure".`,
    SCRIPT: `You are a teacher writing a short, engaging script for students based on this lesson plan: {planText}. Write a 2-minute spoken script that explains the core concepts clearly. Use smooth transitions and a friendly tone. Output paragraphs with stage notes for visuals, like '[Show a diagram of the water cycle]'.`,
    IMAGE_PROMPTS: `Generate 5 concise image prompts (1 per scene) for the lesson script below. Each should describe an educational visual that supports the script. The style should be a clean, flat, black-and-white illustration on a white background, like a modern textbook diagram. Respond in a valid JSON array of strings.`,
    SUBSTITUTE_NOTE: `You are an assistant principal. Based on the following lesson plan, write a brief, clear, and friendly note for a substitute teacher. Include the lesson objective, a quick summary of activities, and any key materials they'll need. Format it for easy printing.\n\nLesson Plan:\n{planText}`
};

export const PROGRESS_STEPS: Record<string, Omit<ProgressStep, 'status'>> = {
    script: { key: 'script', label: 'Composing Script…' },
    visuals: { key: 'visuals', label: 'Developing Slides…' },
    voiceover: { key: 'voiceover', label: 'Narration in Progress…' },
    assembly: { key: 'assembly', label: 'Assembling Video…' },
    sub_note: { key: 'sub_note', label: 'Preparing Substitute Note…' },
};