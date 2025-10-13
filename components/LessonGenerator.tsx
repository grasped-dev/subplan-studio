
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Dropdown } from './Dropdown';
import { TextArea } from './TextArea';
import { GRADE_LEVELS } from '../constants';
import type { LessonPlan, Standard } from '../types';
import { generateLessonPlan } from '../services/geminiService';
import { getCategoriesForGrade, getStandards } from '../services/standardsService';

interface LessonGeneratorProps {
    onGenerated: (lessonPlan: LessonPlan) => void;
    onBack: () => void;
}

export const LessonGenerator: React.FC<LessonGeneratorProps> = ({ onGenerated, onBack }) => {
    const [grade, setGrade] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [availableStandards, setAvailableStandards] = useState<Standard[]>([]);
    const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
    const [priorLearning, setPriorLearning] = useState('');
    const [focus, setFocus] = useState('');
    
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingStandards, setIsLoadingStandards] = useState(false);
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<LessonPlan | null>(null);

    // Fetch categories when grade changes
    useEffect(() => {
        setCategories([]);
        setSelectedCategory('');
        setAvailableStandards([]);
        setSelectedStandards([]);

        if (!grade) {
            return;
        }

        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const fetchedCategories = await getCategoriesForGrade(grade);
                setCategories(fetchedCategories);
                if (fetchedCategories.length > 0) {
                    setSelectedCategory(fetchedCategories[0]);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [grade]);
    
    // Fetch standards when selectedCategory changes
    useEffect(() => {
        if (!selectedCategory) {
            setAvailableStandards([]);
            return;
        }

        const fetchStandards = async () => {
            setIsLoadingStandards(true);
            setAvailableStandards([]);
            setSelectedStandards([]);

            try {
                const fetchedStandards = await getStandards(grade, selectedCategory);
                setAvailableStandards(fetchedStandards);
            } catch (error) {
                console.error("Failed to fetch standards:", error);
            } finally {
                setIsLoadingStandards(false);
            }
        };
        
        fetchStandards();
    }, [grade, selectedCategory]);


    const handleStandardChange = (standardId: string) => {
        setSelectedStandards(prev =>
            prev.includes(standardId)
                ? prev.filter(id => id !== standardId)
                : [...prev, standardId]
        );
    };
    
    const handleGeneratePlan = async () => {
        setIsGenerating(true);
        try {
            const plan = await generateLessonPlan(grade, selectedStandards, priorLearning, focus);
            setGeneratedPlan(plan);
        } catch (error) {
            console.error("Failed to generate lesson plan:", error);
            // Show error to user in a real app
        } finally {
            setIsGenerating(false);
        }
    };
    
    if (generatedPlan) {
        return (
            <div className="w-full max-w-3xl mx-auto p-8 border-2 border-border rounded-lg bg-white/80 backdrop-blur-sm">
                <h2 className="font-serif text-3xl font-bold mb-2 text-center">Generated Lesson Plan</h2>
                <p className="text-center text-gray-600 mb-6">Review the plan below. You can now proceed to generate the video.</p>
                <div className="space-y-4 p-4 bg-preview-bg rounded-md border border-border text-sm leading-relaxed">
                    <p><strong>Objective:</strong> {generatedPlan.objective}</p>
                    <p><strong>Materials:</strong> {generatedPlan.materials.join(', ')}</p>
                    <div><strong>Procedure:</strong>
                        <ul className="list-decimal list-inside ml-4 space-y-1 mt-1">
                            {generatedPlan.procedure.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                    </div>
                    <p><strong>Checks for Understanding:</strong> {generatedPlan.checks.join(', ')}</p>
                    <p><strong>Closure:</strong> {generatedPlan.closure}</p>
                </div>
                <div className="flex items-center justify-between gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setGeneratedPlan(null)}>Edit Prompts</Button>
                    <Button onClick={() => onGenerated(generatedPlan)}>Generate Video from this Plan</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-8 border-2 border-border rounded-lg bg-white/80 backdrop-blur-sm">
            <h2 className="font-serif text-3xl font-bold mb-6 text-center">Generate a Lesson Plan</h2>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Dropdown id="gradeLevel" label="Grade Level" value={grade} onChange={e => {setGrade(e.target.value)}}>
                        <option value="" disabled>Choose a grade level</option>
                        {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                    </Dropdown>

                    <Dropdown id="category" label="Category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} disabled={!grade || isLoadingCategories || categories.length === 0}>
                         {!grade ? (
                             <option value="">Select a grade first</option>
                         ) : isLoadingCategories ? (
                            <option>Loading categories...</option>
                        ) : categories.length > 0 ? (
                            categories.map(c => <option key={c} value={c}>{c}</option>)
                        ) : (
                            <option value="">No categories found</option>
                        )}
                    </Dropdown>
                    
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 font-sans tracking-wide">Standards</label>
                        <p className="text-xs text-gray-500 mb-2">Select only the standards that this individual lesson will cover.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border-2 border-border rounded-md min-h-[10rem] max-h-48 overflow-y-auto">
                            {isLoadingStandards ? (
                                <p className="text-gray-500 col-span-full">Loading standards...</p>
                            ) : availableStandards.length > 0 ? (
                                availableStandards.map(s => (
                                    <label key={s.id} className="flex items-start p-2 rounded-md hover:bg-preview-bg transition-colors cursor-pointer">
                                        <input type="checkbox" checked={selectedStandards.includes(s.id)} onChange={() => handleStandardChange(s.id)} className="mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
                                        <span><strong>{s.id}:</strong> {s.description}</span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-gray-500 col-span-full">{!grade ? 'Please select a grade.' : 'Please select a category.'}</p>
                            )}
                        </div>
                    </div>
                </div>
                <TextArea id="priorLearning" label="What was covered previously?" value={priorLearning} onChange={e => setPriorLearning(e.target.value)} rows={3} placeholder="e.g., Students have learned to identify numerators and denominators." />
                <TextArea id="focus" label="What should this lesson focus on?" value={focus} onChange={e => setFocus(e.target.value)} rows={3} placeholder="e.g., Finding common denominators and creating equivalent fractions."/>
                <div className="flex items-center justify-between gap-4 pt-4 border-t-2 border-dashed border-border">
                    <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
                    <Button onClick={handleGeneratePlan} disabled={isGenerating || selectedStandards.length === 0 || !focus.trim()}>
                        {isGenerating ? 'Generating...' : 'Generate Lesson Plan'}
                    </Button>
                </div>
            </div>
        </div>
    );
};