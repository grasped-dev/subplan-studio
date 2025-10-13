import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center border-b-2 border-black pb-4">
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-wide">SubPlan Studio</h1>
            <p className="font-sans text-sm sm:text-base mt-2 text-gray-700 max-w-2xl mx-auto">Create seamless sub plans complete with AI-generated video lessons. Because learning shouldn’t pause when you’re out.</p>
        </header>
    );
};