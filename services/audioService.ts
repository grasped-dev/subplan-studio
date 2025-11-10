const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Popular voice IDs from ElevenLabs (you can change these)
// Rachel - calm, clear female voice good for educational content
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

interface GenerateAudioOptions {
    text: string;
    voiceId?: string;
    stability?: number;  // 0-1, higher = more stable/consistent
    similarityBoost?: number;  // 0-1, higher = closer to original voice
}

/**
 * Generates audio from text using ElevenLabs API
 * @returns Audio blob that can be played or downloaded
 */
export const generateAudio = async ({
    text,
    voiceId = DEFAULT_VOICE_ID,
    stability = 0.5,
    similarityBoost = 0.75,
}: GenerateAudioOptions): Promise<Blob> => {
    if (!ELEVENLABS_API_KEY) {
        throw new Error('ElevenLabs API key not configured');
    }

    console.log('Generating audio with ElevenLabs...');
    console.log(`Text length: ${text.length} characters`);
    
    try {
        const response = await fetch(
            `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY,
                },
                body: JSON.stringify({
                    text: text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: stability,
                        similarity_boost: similarityBoost,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs API error:', errorText);
            throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
        }

        const audioBlob = await response.blob();
        console.log('Audio generated successfully');
        console.log(`Audio size: ${(audioBlob.size / 1024).toFixed(2)} KB`);
        
        return audioBlob;
    } catch (error) {
        console.error('Failed to generate audio:', error);
        throw error;
    }
};

/**
 * Prepares script text for audio generation by removing visual cues and formatting
 */
export const prepareScriptForAudio = (script: string): string => {
    const headerRegex = /\*\*(.*?)\s*\(.*?\)\*\*/gi;
    const visualCueRegex = /\[VISUAL CUE:.*?\]/gi;
    const whitespaceRegex = /\s+/g;
    
    return script
        // Remove visual cue markers
        .replace(visualCueRegex, '')
        // Remove section headers like **INTRODUCTION (30-45 seconds)**
        .replace(headerRegex, '')
        // Remove extra whitespace
        .replace(whitespaceRegex, ' ')
        .trim();
};

/**
 * Creates an audio URL from a blob for playback
 */
export const createAudioURL = (blob: Blob): string => {
    return URL.createObjectURL(blob);
};

/**
 * Triggers download of audio file
 */
export const downloadAudio = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.mp3') ? filename : `${filename}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};