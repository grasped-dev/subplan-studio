
export type Workflow = 'upload' | 'generate';

export interface LessonPlan {
    objective: string;
    materials: string[];
    procedure: string[];
    checks: string[];
    closure: string;
}

export interface Standard {
    id: string;
    description: string;
}

export interface ProgressStep {
    key: string;
    label: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
}

export interface OutputPreferences {
    substituteNote: boolean;
    slides: boolean;
    video: boolean;
    audio: boolean;
}
