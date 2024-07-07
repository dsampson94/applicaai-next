import React, { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e293b]">
            {children}
        </div>
    );
};

export default AuthLayout;
