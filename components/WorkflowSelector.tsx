
import React from 'react';
import type { Workflow } from '../types';
import { Button } from './Button';

interface WorkflowSelectorProps {
    onSelect: (workflow: Workflow) => void;
}

export const WorkflowSelector: React.FC<WorkflowSelectorProps> = ({ onSelect }) => {
    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 p-8 border-2 border-dashed border-border rounded-lg bg-white/80 backdrop-blur-sm">
            <div className="flex-1 text-center">
                <h2 className="font-serif text-2xl font-bold mb-4">I Have a Lesson Plan</h2>
                <p className="mb-6 text-gray-600 leading-relaxed">Upload your existing lesson plan (text, PDF, or Doc) to generate a video.</p>
                <Button onClick={() => onSelect('upload')}>Start with My Plan</Button>
            </div>
            <div className="w-px h-32 bg-border hidden md:block"></div>
             <div className="w-32 h-px bg-border md:hidden"></div>
            <div className="flex-1 text-center">
                <h2 className="font-serif text-2xl font-bold mb-4">Create a Lesson Plan</h2>
                <p className="mb-6 text-gray-600 leading-relaxed">Generate a new, standards-aligned lesson plan from scratch using AI.</p>
                <Button onClick={() => onSelect('generate')}>Generate a New Plan</Button>
            </div>
        </div>
    );
};