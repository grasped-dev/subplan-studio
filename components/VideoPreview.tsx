import React from 'react';
import { Button } from './Button';
import { downloadPowerPoint } from '../services/slidesService';

interface VideoPreviewProps {
    videoUrl: string | null;
    images: string[];
    substituteNote: string | null;
    onReset: () => void;
    powerPointBlob: Blob | null;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl, images, substituteNote, onReset, powerPointBlob }) => {
    
    const handleDownloadPowerPoint = () => {
        if (powerPointBlob) {
            downloadPowerPoint(powerPointBlob, 'SubPlan-Studio-Lesson.pptx');
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
                        <Button onClick={handleDownloadPowerPoint} disabled={!powerPointBlob}>
                            {powerPointBlob ? 'Download PowerPoint' : 'Generating Presentation...'}
                        </Button>
                     </div>
                </div>
            </div>
            <div className="text-center mt-12">
                <Button onClick={onReset}>Create Another Lesson</Button>
            </div>
        </div>
    );
};