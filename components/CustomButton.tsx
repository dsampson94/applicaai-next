'use client';

import React from 'react';

interface CustomButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children, className }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 border-2 border-transparent hover:bg-blue-600 hover:border-blue-600 active:bg-transparent active:text-blue-500 active:border-blue-500 ${className}`}
        >
            {children}
        </button>
    );
};

export default CustomButton;
