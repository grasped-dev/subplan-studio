import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, id, ...props }) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium mb-1 font-sans tracking-wide">{label}</label>
            <textarea
                id={id}
                className="w-full p-2 border-2 border-border bg-brand-white rounded-[6px] focus:ring-accent focus:border-accent transition-colors duration-200 font-sans"
                rows={5}
                {...props}
            />
        </div>
    );
};