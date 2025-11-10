import React from 'react';
import { Button } from './Button';
import { downloadPowerPoint } from '../services/slidesService';
import { downloadAudio } from '../services/audioService';

interface VideoPreviewProps {
    videoUrl: string | null;
    images: string[];
    substituteNote: string | null;
    onReset: () => void;
    powerPointBlob: Blob | null;
    hasSlides?: boolean;
    audioUrl?: string | null;
    audioBlob?: Blob | null;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl, images, substituteNote, onReset, powerPointBlob, hasSlides, audioUrl, audioBlob }) => {
    
    const handleDownloadPowerPoint = () => {
        if (powerPointBlob) {
            downloadPowerPoint(powerPointBlob, 'SubPlan-Studio-Lesson.pptx');
        }
    };

    const handleDownloadAudio = () => {
        if (audioBlob) {
            downloadAudio(audioBlob, 'SubPlan_Studio_Narration.mp3');
        }
    };
    
    return (
        <div className="w-full">
            <h2 className="font-serif text-4xl font-bold mb-8 text-center">Your Lesson is Ready!</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-6 bg-white/80 backdrop-blur-sm border-2 border-border rounded-lg">
                    <h3 className="font-serif text-2xl font-bold mb-4">Video Lesson</h3>
                     <div className="aspect-video bg-black rounded-md flex items-center justify-center text-gray-400">
                        {/* In a real app, this would be a <video> element */}
                        <p>Video Preview Placeholder ({videoUrl})</p>
                    </div>
                    
                    <h4 className="font-serif text-xl font-bold mt-6 mb-3">Generated Slides</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {images.map((img, index) => (
                            <img key={index} src={img} alt={`Slide ${index + 1}`} className="aspect-video object-cover rounded-md border border-border" />
                        ))}
                    </div>

                    {hasSlides && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800">
                                ✅ <strong>PowerPoint presentation generated!</strong> You can download it from the downloads section.
                            </p>
                        </div>
                    )}
                </div>
                <div className="lg:col-span-1 p-6 bg-white/80 backdrop-blur-sm border-2 border-border rounded-lg flex flex-col gap-8">
                     <div>
                         <h3 className="font-serif text-2xl font-bold mb-4">Substitute Note</h3>
                         <div className="whitespace-pre-wrap p-4 bg-brand-white border border-border rounded-md font-sans text-sm leading-relaxed max-h-96 overflow-y-auto">
                            {substituteNote || 'No note generated.'}
                         </div>
                     </div>
                     <div>
                        <h3 className="font-serif text-2xl font-bold mb-4">Downloads</h3>
                        <div className="space-y-4">
                            <Button onClick={handleDownloadPowerPoint} disabled={!powerPointBlob}>
                                {powerPointBlob ? 'Download PowerPoint' : 'No Presentation Generated'}
                            </Button>
                        </div>
                     </div>
                     {audioUrl && (
                        <div>
                            <h3 className="font-serif text-2xl font-bold mb-4">Audio Narration</h3>
                            <audio controls className="w-full mb-3">
                                <source src={audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            <Button 
                                variant="secondary" 
                                onClick={handleDownloadAudio}
                                disabled={!audioBlob}
                            >
                                Download Audio (MP3)
                            </Button>
                        </div>
                     )}
                </div>
            </div>
            <div className="text-center mt-12">
                <Button onClick={onReset}>Create Another Lesson</Button>
            </div>
        </div>
    );
};