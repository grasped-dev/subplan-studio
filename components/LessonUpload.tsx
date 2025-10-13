
import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { TextArea } from './TextArea';

interface LessonUploadProps {
    onSubmit: (lessonPlanText: string) => void;
    onBack: () => void;
}

export const LessonUpload: React.FC<LessonUploadProps> = ({ onSubmit, onBack }) => {
    const [lessonPlan, setLessonPlan] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            // In a real app, you would process the PDF content here.
            // For this mock implementation, we'll populate the textarea with placeholder content
            // to allow the user to proceed with the video generation flow.
            const mockPdfContent = `[Content from ${file.name}]

Objective: Students will be able to identify the main characteristics of the five vertebrate groups (mammals, birds, reptiles, amphibians, and fish).

Materials:
- Whiteboard or chart paper
- Markers
- Pictures or videos of various animals from each vertebrate group
- "Vertebrate Sorting" worksheet

Procedure:
1. Introduction (5 mins): Ask students what all animals with backbones are called. Introduce the term "vertebrate."
2. Presentation (10 mins): Present each of the five groups, discussing their key features (e.g., mammals have hair/fur and produce milk, birds have feathers and lay eggs).
3. Activity (15 mins): Students work in groups to sort pictures of animals into the correct vertebrate category on their worksheet.
4. Discussion (5 mins): Review the worksheet as a class, discussing why each animal belongs to its group.

Closure: Students will name one characteristic for three different vertebrate groups on an exit ticket.`;
            setLessonPlan(mockPdfContent);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleClearUpload = () => {
        setLessonPlan('');
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (lessonPlan.trim()) {
            onSubmit(lessonPlan.trim());
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-8 border-2 border-border rounded-lg bg-white/80 backdrop-blur-sm">
            <h2 className="font-serif text-3xl font-bold mb-6 text-center">Upload Your Lesson Plan</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-center text-gray-600">You can upload a PDF or paste your lesson plan content below.</p>
                
                <div className="p-4 border-2 border-dashed border-border rounded-md text-center bg-preview-bg">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden"
                        aria-hidden="true"
                    />
                    <Button type="button" onClick={handleUploadClick} variant="secondary">
                        Upload PDF
                    </Button>
                    {fileName && (
                        <div className="mt-3 text-sm text-gray-700">
                            <p>
                                <span className="font-semibold">File:</span> {fileName}
                            </p>
                             <button type="button" onClick={handleClearUpload} className="text-accent underline hover:text-black text-xs mt-1">
                                Clear and use text area instead
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-4 text-gray-500 font-sans text-sm font-semibold">OR</span>
                    <div className="flex-grow border-t border-border"></div>
                </div>

                <TextArea
                    id="lessonPlanText"
                    label="Paste Lesson Plan Here"
                    value={lessonPlan}
                    onChange={(e) => {
                        setLessonPlan(e.target.value);
                        // If user starts typing, clear the uploaded file state
                        if (fileName) {
                            handleClearUpload();
                        }
                    }}
                    rows={12}
                    placeholder="Objective: Students will be able to add and subtract fractions with unlike denominators..."
                    required
                />
                <div className="flex items-center justify-between gap-4 pt-4 border-t-2 border-dashed border-border">
                    <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
                    <Button type="submit" disabled={!lessonPlan.trim()}>Generate Video</Button>
                </div>
            </form>
        </div>
    );
};
