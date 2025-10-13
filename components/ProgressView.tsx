import React from 'react';
import type { ProgressStep } from '../types';

interface ProgressViewProps {
    progressSteps: ProgressStep[];
}

const StatusIcon: React.FC<{ status: ProgressStep['status'] }> = ({ status }) => {
    switch (status) {
        case 'completed':
            return <span className="text-green-500">✓</span>;
        case 'in_progress':
            return (
                <svg className="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            );
        case 'error':
            return <span className="text-red-500">✗</span>;
        default:
             return <span className="text-gray-400">●</span>;
    }
};

export const ProgressView: React.FC<ProgressViewProps> = ({ progressSteps }) => {
    return (
        <div className="w-full max-w-2xl mx-auto p-8 border-2 border-border bg-white/80 backdrop-blur-sm rounded-lg">
            <h2 className="font-serif text-3xl font-bold mb-6 text-center">Your Lesson is Printing...</h2>
            <div className="space-y-4">
                {progressSteps.map((step) => (
                    <div key={step.key} className="flex items-center justify-between p-3 bg-brand-white border-l-4 border-accent rounded-r-md">
                        <p className={`font-sans text-lg tracking-wider ${step.status !== 'pending' ? 'text-text' : 'text-gray-400'}`}>
                            {step.label}
                        </p>
                        <div className="w-6 h-6 flex items-center justify-center">
                            <StatusIcon status={step.status} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};