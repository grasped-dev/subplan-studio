import PptxGenJS from 'pptxgenjs';

interface SlideContent {
    title: string;
    content: string[];
    visualCue?: string;
}

/**
 * Parses the script to extract slide content based on visual cues and structure
 */
const parseScriptToSlides = (script: string): SlideContent[] => {
    const slides: SlideContent[] = [];
    
    // Title slide
    slides.push({
        title: "Today's Lesson",
        content: [],
    });
    
    // Extract sections and visual cues. The regex is case-insensitive and captures the title.
    const sections = script.split(/\*\*(.*?)\s*\(.*?\)\*\*/i);
    
    for (let i = 1; i < sections.length; i += 2) {
        const sectionTitle = sections[i].trim();
        const sectionContent = sections[i + 1]?.trim() || '';
        
        // Find visual cues in this section
        const visualCueMatch = sectionContent.match(/\[VISUAL CUE:([^\]]+)\]/);
        
        // Extract bullet points (sentences that would work as bullets)
        const sentences = sectionContent
            .replace(/\[VISUAL CUE:[^\]]+\]/g, '')
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 10 && s.length < 150)
            .slice(0, 4); // Max 4 bullets per slide
        
        if (sentences.length > 0 && sectionTitle) {
            slides.push({
                title: sectionTitle,
                content: sentences,
                visualCue: visualCueMatch ? visualCueMatch[1].trim() : undefined,
            });
        }
    }
    
    // Final slide
    slides.push({
        title: "Questions?",
        content: ["Let's review what we learned today!"],
    });
    
    return slides;
};

/**
 * Generates a PowerPoint presentation from a lesson script
 */
export const generatePowerPoint = async (script: string, lessonTitle: string): Promise<Blob> => {
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'SubPlan Studio';
    pptx.title = lessonTitle;
    pptx.subject = 'Educational Lesson';
    
    // Define a clean, professional theme
    const COLORS = {
        primary: '2B2B2B',
        secondary: '666666',
        accent: '4A90E2',
        light: 'F9F9F9',
    };
    
    const slides = parseScriptToSlides(script);
    
    slides.forEach((slideContent, index) => {
        const slide = pptx.addSlide();
        
        // Add background
        slide.background = { color: 'FFFFFF' };
        
        if (index === 0) {
            // Title slide
            slide.addText(lessonTitle, {
                x: 0.5,
                y: 2.0,
                w: 9,
                h: 1.5,
                fontSize: 44,
                bold: true,
                color: COLORS.primary,
                align: 'center',
            });
            
            slide.addText('SubPlan Studio', {
                x: 0.5,
                y: 4.0,
                w: 9,
                h: 0.5,
                fontSize: 18,
                color: COLORS.secondary,
                align: 'center',
            });
        } else {
            // Content slide
            // Title
            slide.addText(slideContent.title, {
                x: 0.5,
                y: 0.5,
                w: 9,
                h: 0.75,
                fontSize: 32,
                bold: true,
                color: COLORS.primary,
            });
            
            // Divider line
            slide.addShape(pptx.ShapeType.rect, {
                x: 0.5,
                y: 1.3,
                w: 9,
                h: 0.02,
                fill: { color: COLORS.accent },
            });
            
            // Content bullets
            if (slideContent.content.length > 0) {
                slide.addText(slideContent.content.map(c => ({ text: c, options: { bullet: true } })), {
                    x: 0.75,
                    y: 1.7,
                    w: 8.5,
                    h: 3.5,
                    fontSize: 18,
                    color: COLORS.secondary,
                    bullet: { type: 'number' },
                    lineSpacing: 28,
                });
            }
            
            // Visual cue note (if present)
            if (slideContent.visualCue) {
                slide.addText(`💡 Visual: ${slideContent.visualCue}`, {
                    x: 0.5,
                    y: 5.3,
                    w: 9,
                    h: 0.5,
                    fontSize: 14,
                    italic: true,
                    color: COLORS.accent,
                });
            }
        }
        
        // Slide number (except title slide)
        if (index > 0) {
            slide.addText(`${index}`, {
                x: 9.3,
                y: 5.3,
                w: 0.5,
                h: 0.3,
                fontSize: 12,
                color: COLORS.secondary,
                align: 'right',
            });
        }
    });
    
    // Generate and return as blob
    const blob = await pptx.write({ outputType: 'blob' }) as Blob;
    return blob;
};

/**
 * Triggers download of the PowerPoint file
 */
export const downloadPowerPoint = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.pptx') ? filename : `${filename}.pptx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};