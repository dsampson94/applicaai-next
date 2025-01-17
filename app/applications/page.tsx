'use client'

import {useState} from 'react';
import JobApplicationsTable from '../../components/ApplicationsTable';
import JobApplicationsKanban from '../../components/ApplicationsKanban';
import DataControlModal from '../../components/DataControlModal';
import JobApplicationModal from '../../components/ApplicationsModal';

const JobApplicationsDashboard = () => {
    const [isDataControlModalOpen, setIsDataControlModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
    const [isJobApplicationModalOpen, setIsJobApplicationModalOpen] = useState(false);
    const [selectedJobApplication, setSelectedJobApplication] = useState(null);

    const handleOpenModal = (jobApplication: null) => {
        setSelectedJobApplication(jobApplication);
        setIsJobApplicationModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-4">Job Applications</h1>
                <div>
                    {/*<button*/}
                    {/*    onClick={() => setIsDataControlModalOpen(true)}*/}
                    {/*    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"*/}
                    {/*>*/}
                    {/*    Data Control*/}
                    {/*</button>*/}
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Create New
                    </button>
                    <button
                        onClick={() => setViewMode(viewMode === 'table' ? 'kanban' : 'table')}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {viewMode === 'table' ? 'Switch to Kanban' : 'Switch to Table'}
                    </button>
                </div>
            </div>
            {viewMode === 'table' ?
                <JobApplicationsTable onOpenModal={handleOpenModal}/> :
                <JobApplicationsKanban onOpenModal={handleOpenModal}/>
            }
            {isDataControlModalOpen && (
                <DataControlModal onClose={() => setIsDataControlModalOpen(false)}/>
            )}
            {isJobApplicationModalOpen && (
                <JobApplicationModal
                    application={selectedJobApplication}
                    onClose={() => setIsJobApplicationModalOpen(false)}
                />
            )}
        </div>
    );
};

export default JobApplicationsDashboard;
