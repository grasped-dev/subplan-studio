import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { WorkflowSelector } from './components/WorkflowSelector';
import { LessonUpload } from './components/LessonUpload';
import { LessonGenerator } from './components/LessonGenerator';
import { ProgressView } from './components/ProgressView';
import { VideoPreview } from './components/VideoPreview';
import { generateLessonPlan, generateScript, generateImagePrompts, generateSubstituteNote } from './services/geminiService';
import { generateImages, assembleVideo } from './services/videoService';
import type { Workflow, LessonPlan, ProgressStep } from './types';
import { PROGRESS_STEPS } from './constants';

const App: React.FC = () => {
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<ProgressStep[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [substituteNote, setSubstituteNote] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);

    const handleReset = useCallback(() => {
        setWorkflow(null);
        setIsLoading(false);
        setProgress([]);
        setVideoUrl(null);
        setSubstituteNote(null);
        setImages([]);
    }, []);

    const runVideoGenerationProcess = useCallback(async (lessonPlanText: string) => {
        setIsLoading(true);
        setProgress([]);

        const updateProgress = (stepKey: string, status: 'in_progress' | 'completed' | 'error') => {
            setProgress(prev => {
                const existingStepIndex = prev.findIndex(s => s.key === stepKey);
                if (existingStepIndex > -1) {
                    const newProgress = [...prev];
                    newProgress[existingStepIndex].status = status;
                    return newProgress;
                }
                return [...prev, { ...PROGRESS_STEPS[stepKey], status }];
            });
        };
        
        try {
            updateProgress('script', 'in_progress');
            const script = await generateScript(lessonPlanText);
            updateProgress('script', 'completed');

            updateProgress('visuals', 'in_progress');
            const imagePrompts = await generateImagePrompts(script);
            const generatedImages = await generateImages(imagePrompts);
            setImages(generatedImages);
            updateProgress('visuals', 'completed');

            updateProgress('voiceover', 'in_progress');
            // Mock voiceover generation
            await new Promise(res => setTimeout(res, 1500));
            updateProgress('voiceover', 'completed');

            updateProgress('assembly', 'in_progress');
            const finalVideoUrl = await assembleVideo();
            setVideoUrl(finalVideoUrl);
            updateProgress('assembly', 'completed');
            
            updateProgress('sub_note', 'in_progress');
            const note = await generateSubstituteNote(lessonPlanText);
            setSubstituteNote(note);
            updateProgress('sub_note', 'completed');

        } catch (error) {
            console.error("Error during video generation:", error);
            // In a real app, you'd show an error message
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLessonPlanGenerated = useCallback((lessonPlan: LessonPlan) => {
        const lessonPlanText = `Objective: ${lessonPlan.objective}\n\nMaterials: ${lessonPlan.materials.join(', ')}\n\nProcedure:\n${lessonPlan.procedure.join('\n')}\n\nChecks for Understanding: ${lessonPlan.checks.join(', ')}\n\nClosure: ${lessonPlan.closure}`;
        runVideoGenerationProcess(lessonPlanText);
    }, [runVideoGenerationProcess]);


    const renderContent = () => {
        if (isLoading) {
            return <ProgressView progressSteps={progress} />;
        }
        if (videoUrl) {
            return <VideoPreview videoUrl={videoUrl} images={images} substituteNote={substituteNote} onReset={handleReset} />;
        }
        switch (workflow) {
            case 'upload':
                return <LessonUpload onSubmit={runVideoGenerationProcess} onBack={() => setWorkflow(null)} />;
            case 'generate':
                return <LessonGenerator onGenerated={handleLessonPlanGenerated} onBack={() => setWorkflow(null)} />;
            default:
                return <WorkflowSelector onSelect={setWorkflow} />;
        }
    };

    return (
        <div className="min-h-screen text-text flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-6xl mx-auto">
                <Header />
                <main className="mt-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;