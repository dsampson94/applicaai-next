'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FaUserCircle, FaChevronLeft, FaChevronRight, FaTachometerAlt } from 'react-icons/fa';
import Image from 'next/image';
import aplicaLogo from '../public/applica-nobg-white-t.png';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const menuItems = [
        { text: 'Profile', icon: <FaUserCircle />, path: '/profile' },
        { text: 'Applications', icon: <FaTachometerAlt />, path: '/applications' },
        { text: 'Users', icon: <FaUserCircle />, path: '/users' }
    ];

    return (
        <div className={`flex flex-col h-full bg-[#1e293b] text-white shadow-lg transition-width duration-300 ${isOpen ? 'min-w-60' : 'w-12'}`}>
            <div className="flex items-center justify-between p-4">
                <button onClick={toggleSidebar} className="text-white focus:outline-none">
                    {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
                {isOpen && <Image src={aplicaLogo} alt="Applica Logo" width={120} height={100} className="mr-6" />}
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
                {menuItems.map(({ text, icon, path }) => (
                    <div
                        key={text}
                        className={`flex items-center p-4 cursor-pointer hover:bg-opacity-20 rounded-md transition-colors duration-200 ${pathname === path ? 'bg-opacity-10 bg-white' : ''}`}
                        onClick={() => handleNavigation(path)}
                        title={!isOpen ? text : ''}
                    >
                        <div className="text-white">{icon}</div>
                        {isOpen && (
                            <span className="ml-4 text-base font-semibold">{text}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
