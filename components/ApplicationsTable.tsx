import { useState } from 'react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import InsightsModal from './InsightsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { toast } from 'react-toastify';
import axios from 'axios';

interface JobApplicationsTableProps {
    onOpenModal: (jobApplication: any | null) => void;
}

const JobApplicationsTable: React.FC<JobApplicationsTableProps> = ({ onOpenModal }) => {
    const [selectedJobApplication, setSelectedJobApplication] = useState<any | null>(null);
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<any | null>(null);
    const [jobApplications, setJobApplications] = useState<any[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            axios.get('/api/applications').then(response => {
                setJobApplications(response.data);
            });
        }
    }, [session]);

    const handleRemove = () => {
        if (jobToDelete) {
            axios.delete(`/api/applications/${jobToDelete._id}`)
                .then(() => {
                    toast.success('Job application deleted successfully');
                    setJobApplications(prev => prev.filter(job => job._id !== jobToDelete._id));
                })
                .catch(error => {
                    toast.error(`Failed to delete job application: ${error.message}`);
                });
            setIsDeleteModalOpen(false);
            setJobToDelete(null);
        }
    };

    const handleOpenInsightsModal = (jobApplication: any | null) => {
        setSelectedJobApplication(jobApplication);
        setIsInsightsModalOpen(true);
    };

    const handleOpenDeleteModal = (jobApplication: any) => {
        setJobToDelete(jobApplication);
        setIsDeleteModalOpen(true);
    };

    return (
        <div>
            <div className="text-center">
                <div className="overflow-auto max-h-[80vh]">
                    <table className="min-w-full bg-white">
                        <thead className="sticky top-0 bg-white">
                        <tr>
                            <th className="py-2 max-w-xs">Company</th>
                            <th className="py-2 max-w-xs">Role</th>
                            <th className="py-2 max-w-xs">Status</th>
                            <th className="py-2 max-w-xs">Job Spec</th>
                            <th className="py-2 max-w-xs">CV</th>
                            <th className="py-2 max-w-xs">Tags</th>
                            <th className="py-2 max-w-xs">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {jobApplications.map((jobApplication) => (
                            <tr key={jobApplication._id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2 max-w-xs truncate">{jobApplication.company}</td>
                                <td className="border px-4 py-2 max-w-xs truncate">{jobApplication.role}</td>
                                <td className="border px-4 py-2 max-w-xs truncate">{jobApplication.status}</td>
                                <td className="border px-4 py-2 max-w-[150px] truncate">
                                    {jobApplication.jobSpecName ? (
                                        <a
                                            href={jobApplication.jobSpec}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            {jobApplication.jobSpecName}
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td className="border px-4 py-2 max-w-[150px] truncate">
                                    {jobApplication.cvName ? (
                                        <a
                                            href={jobApplication.cvUrl || '#'}
                                            download={jobApplication.cvName}
                                            className="text-blue-500 underline"
                                        >
                                            {jobApplication.cvName}
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td className="border px-4 py-2 max-w-xs">
                                    <div className="flex flex-wrap">
                                        {jobApplication.tags?.map((tag: string) => (
                                            <span key={tag} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2">{tag}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="border px-4 py-2 max-w-xs">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button
                                            onClick={() => handleOpenInsightsModal(jobApplication)}
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                        >
                                            Insights
                                        </button>
                                        <button
                                            onClick={() => onOpenModal(jobApplication)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleOpenDeleteModal(jobApplication)}
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isInsightsModalOpen && (
                <InsightsModal
                    application={selectedJobApplication}
                    onClose={() => setIsInsightsModalOpen(false)}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    onConfirm={handleRemove}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default JobApplicationsTable;
