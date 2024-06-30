'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ApplicationsKanban from '../../components/ApplicationsKanban';
import { IApplication } from '../../lib/models/Application';
import DataControlModal from '../../components/DataControlModal';
import ApplicationsModal from "../../components/ApplicationsModal";

const Applications: React.FC = () => {
    const [applications, setApplications] = useState<IApplication[]>([]);
    const [isDataControlModalOpen, setIsDataControlModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<IApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('/api/applications');
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching job applications:', error);
                setError('Error fetching job applications');
                toast.error('Error fetching job applications');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleOpenModal = (application: IApplication | null) => {
        setSelectedApplication(application);
        setIsApplicationModalOpen(true);
    };

    const handleAddApplication = (newApplication: IApplication) => {
        setApplications((prevApplications) => [newApplication, ...prevApplications]);
    };

    const handleUpdateApplication = (updatedApplication: IApplication) => {
        setApplications((prevApplications) =>
            prevApplications.map((app) =>
                app._id === updatedApplication._id ? updatedApplication : app
            )
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-4">Job Applications</h1>
                <div>
                    <button
                        onClick={() => setIsDataControlModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 border-2 border-transparent hover:bg-blue-600 hover:border-blue-600 active:bg-transparent active:text-blue-500 active:border-blue-500"
                    >
                        Data Control
                    </button>
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 border-2 border-transparent hover:bg-blue-600 hover:border-blue-600 active:bg-transparent active:text-blue-500 active:border-blue-500"
                    >
                        Create New
                    </button>
                    <button
                        onClick={() => setViewMode(viewMode === 'table' ? 'kanban' : 'table')}
                        className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-transparent hover:bg-blue-600 hover:border-blue-600 active:bg-transparent active:text-blue-500 active:border-blue-500"
                    >
                        {viewMode === 'table' ? 'Switch to Kanban' : 'Switch to Table'}
                    </button>
                </div>
            </div>
            {isDataControlModalOpen && (
                <DataControlModal onClose={() => setIsDataControlModalOpen(false)} />
            )}
            <ApplicationsKanban
                applications={applications}
                onOpenModal={handleOpenModal}
                onUpdateApplication={handleUpdateApplication}
            />
            {isApplicationModalOpen && (
                <ApplicationsModal
                    application={selectedApplication}
                    onClose={() => setIsApplicationModalOpen(false)}
                    onSave={handleAddApplication}
                />
            )}
        </div>
    );
};

export default Applications;
