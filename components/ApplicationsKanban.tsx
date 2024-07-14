import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import InsightsModal from './InsightsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import StarIcon from '@mui/icons-material/Star';
import MagicIcon from '@mui/icons-material/AutoAwesome';
import EyeIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import useJobApplicationsStore from '../lib/store/jobApplicationsStore';
import { Application } from '../lib/types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface JobApplicationsKanbanProps {
    onOpenModal: (jobApplication: Application | null) => void;
}

const JobApplicationsKanban: React.FC<JobApplicationsKanbanProps> = ({ onOpenModal }) => {
    const [selectedJobApplication, setSelectedJobApplication] = useState<Application | null>(null);
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<Application | null>(null);
    const {
        applications = [],
        fetchApplications,
        deleteApplication,
        updateApplication
    } = useJobApplicationsStore();

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleRemove = async () => {
        if (jobToDelete) {
            try {
                await deleteApplication(jobToDelete.id);
                toast.success('Job application deleted successfully');
                setIsDeleteModalOpen(false);
                setJobToDelete(null);
            } catch (error) {
                toast.error(`Failed to delete job application: ${error}`);
            }
        }
    };

    const handleOpenInsightsModal = (jobApplication: Application | null) => {
        setSelectedJobApplication(jobApplication);
        setIsInsightsModalOpen(true);
    };

    const handleOpenDeleteModal = (jobApplication: Application) => {
        setJobToDelete(jobApplication);
        setIsDeleteModalOpen(true);
    };

    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination || source.droppableId === destination.droppableId) {
            return;
        }

        const updatedApplications = [...applications];
        const draggedApplication = updatedApplications.find((app) => app.id === draggableId);

        if (draggedApplication) {
            draggedApplication.status = destination.droppableId;
            updateLocalApplications(updatedApplications);

            updateApplication(draggedApplication.id, { status: destination.droppableId })
                .then(() => {
                    toast.success('Job application status updated successfully');
                })
                .catch((error) => {
                    toast.error(`Failed to update job application status: ${error}`);
                    // Revert to original state on error
                    draggedApplication.status = source.droppableId;
                    updateLocalApplications(updatedApplications);
                });
        }
    };

    const updateLocalApplications = (updatedApplications: Application[]) => {
        // Ensure the state updates reflect immediately
        useJobApplicationsStore.setState({ applications: updatedApplications });
    };

    const columns = [
        { title: 'Not Applied', status: 'Not Applied' },
        { title: 'Applied', status: 'Applied' },
        { title: 'Interviewing', status: 'Interviewing' },
        { title: 'Offered', status: 'Offered' },
        { title: 'Unsuccessful', status: 'Unsuccessful' },
    ];

    // @ts-ignore
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="max-h-[80vh] overflow-hidden">
                <div className="text-center">
                    <div className="flex space-x-4 overflow-x-auto py-4">
                        {columns.map((column) => (
                            <Droppable droppableId={column.status} key={column.status}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="bg-gray-200 rounded-lg flex-1 min-w-[250px] max-h-[80vh] overflow-auto"
                                    >
                                        <div className="sticky top-0 bg-gray-200 z-10 p-4 border-b border-gray-300">
                                            <h2 className="text-xl font-bold mb-2">{column.title}</h2>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            {applications
                                                .filter((job) => job.status === column.status)
                                                .sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite)) // Sort favorites to the top
                                                .map((job, index) => (
                                                    <Draggable key={job.id} draggableId={job.id} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="bg-white rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                                                            >
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="text-left">
                                                                        <div className="font-bold text-lg">
                                                                            {job.company} {job.isFavorite && (
                                                                            <StarIcon className="text-yellow-500" />
                                                                        )}
                                                                        </div>
                                                                        <div className="text-gray-600">{job.role}</div>
                                                                    </div>
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => handleOpenInsightsModal(job)}
                                                                            className="text-white w-8 h-8 p-1 rounded-full flex items-center justify-center bg-green-500 hover:bg-green-600 hover:border-green-600 border-2 border-transparent active:bg-transparent active:text-green-500 active:border-green-500"
                                                                        >
                                                                            <MagicIcon />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => onOpenModal(job)}
                                                                            className="text-white w-8 h-8 p-1 rounded-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 border-2 border-transparent active:bg-transparent active:text-yellow-500 active:border-yellow-500"
                                                                        >
                                                                            <EyeIcon />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleOpenDeleteModal(job)}
                                                                            className="text-white w-8 h-8 p-1 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 hover:border-red-600 border-2 border-transparent active:bg-transparent active:text-red-500 active:border-red-500"
                                                                        >
                                                                            <DeleteIcon />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-2 flex flex-wrap gap-2">
                                                                    {job.tags?.map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className="bg-blue-100 text-blue-800 rounded-full px-3 py-1"
                                                                        >
                                      {tag}
                                    </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
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
        </DragDropContext>
    );
};

export default JobApplicationsKanban;
