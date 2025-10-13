import React from 'react';

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, children, id, ...props }) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium mb-1 font-sans tracking-wide">{label}</label>
            <select
                id={id}
                className="w-full p-2 border-2 border-border bg-brand-white rounded-[6px] focus:ring-accent focus:border-accent transition-colors duration-200"
                {...props}
            >
                {children}
            </select>
        </div>
    );
};