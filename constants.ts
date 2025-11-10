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
    SCRIPT: `You are an experienced teacher creating an engaging lesson script for students. Based on the lesson plan below, write a well-structured 3-5 minute educational script.

STRUCTURE YOUR SCRIPT WITH THESE SECTIONS:

**INTRODUCTION (30-45 seconds)**
- Hook: Start with an engaging question or relatable scenario
- Learning Goal: Clearly state what students will learn
- Connection: Link to prior knowledge mentioned in the lesson plan

**MAIN CONTENT (2-3 minutes)**
- Break the core concept into 2-3 digestible chunks
- Use clear examples and analogies appropriate for the grade level
- Include smooth transitions between ideas
- Add [VISUAL CUE: description] markers where a slide or diagram would help

**PRACTICE/APPLICATION (30-60 seconds)**
- Brief example or guided practice
- Show students how to apply what they learned

**CONCLUSION (20-30 seconds)**
- Summarize the key takeaway in one sentence
- Preview what comes next or how this connects to future learning

TONE & STYLE:
- Conversational and encouraging, like you're talking directly to students
- Use "you" and "we" to create engagement
- Vary sentence length to maintain interest
- Keep vocabulary appropriate for the grade level

Add [VISUAL CUE: description] markers 4-6 times throughout where visual support would enhance understanding. Make each visual cue specific and concrete.

Lesson Plan:
{planText}`,
    IMAGE_PROMPTS: `Generate 5 concise image prompts (1 per scene) for the lesson script below. Each should describe an educational visual that supports the script. The style should be a clean, flat, black-and-white illustration on a white background, like a modern textbook diagram. Respond in a valid JSON array of strings.`,
    SUBSTITUTE_NOTE: `Write a brief, clear note for a substitute teacher based on the lesson plan below. Use plain text with no markdown formatting (no asterisks, no bold, no headers with #). 

Include:
- A friendly greeting
- The lesson objective in one sentence
- A numbered list of the main activities in order
- Key materials needed
- Any important classroom management notes

Do NOT include:
- Any signature or name at the end
- Any markdown formatting symbols
- Section headers with # or **

Keep it concise and printer-friendly.

Lesson Plan:
{planText}`
};

export const PROGRESS_STEPS: Record<string, Omit<ProgressStep, 'status'>> = {
    script: { key: 'script', label: 'Composing Script…' },
    visuals: { key: 'visuals', label: 'Generating Visuals…' },
    presentation: { key: 'presentation', label: 'Creating PowerPoint…' },
    voiceover: { key: 'voiceover', label: 'Narration in Progress…' },
    assembly: { key: 'assembly', label: 'Assembling Video…' },
    sub_note: { key: 'sub_note', label: 'Preparing Substitute Note…' },
};

// Maps frontend grade display names to backend database format
export const mapGradeToApiFormat = (grade: string): string => {
    const gradeMap: Record<string, string> = {
        'Kindergarten': 'K',
        '1st Grade': '1',
        '2nd Grade': '2',
        '3rd Grade': '3',
        '4th Grade': '4',
        '5th Grade': '5',
        '6th Grade': '6',
        '7th Grade': '7',
        '8th Grade': '8',
        '9th Grade': '9',
        '10th Grade': '10',
        '11th Grade': '11',
        '12th Grade': '12'
    };
    
    return gradeMap[grade] || grade;
};