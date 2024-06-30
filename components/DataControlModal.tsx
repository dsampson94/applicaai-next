import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface DataControlModalProps {
    onClose: () => void;
}

const DataControlModal: React.FC<DataControlModalProps> = ({ onClose }) => {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddMockData = async () => {
        setIsAdding(true);
        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    company: 'Test Company',
                    role: 'Test Role',
                    status: 'Applied',
                    jobSpec: 'Test Spec',
                    jobSpecName: 'Test Spec Name',
                    cvName: 'Test CV Name',
                    isFavorite: false,
                    tags: ['Test Tag'],
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add mock job application');
            }

            toast.success('Successfully added 1 mock job application');
        } catch (error: any) {
            toast.error(`Failed to add mock job application: ${error.message}`);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-4">Data Control</h2>
                <button
                    onClick={handleAddMockData}
                    className={`bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isAdding}
                >
                    {isAdding ? 'Adding...' : 'Add 1 Mock Application'}
                </button>
                <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded w-full">
                    Close
                </button>
            </div>
        </div>
    );
};

export default DataControlModal;
