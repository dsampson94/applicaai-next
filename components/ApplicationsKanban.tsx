import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {toast} from 'react-toastify';
import axios from 'axios';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import InsightsModal from './InsightsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import StarIcon from '@mui/icons-material/Star';
import MagicIcon from '@mui/icons-material/AutoAwesome';
import EyeIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

interface JobApplication {
    _id: string;
    role: string;
    company: string;
    status: string;
    tags?: string[];
    isFavorite?: boolean;
}

interface JobApplicationsKanbanProps {
    onOpenModal: (jobApplication: any | null) => void;
}

const JobApplicationsKanban: React.FC<JobApplicationsKanbanProps> = ({onOpenModal}) => {
    const [selectedJobApplication, setSelectedJobApplication] = useState<any | null>(null);
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<JobApplication | null>(null);
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
    const {data: session} = useSession();

    useEffect(() => {
        if (session) {
            axios
                .get('/api/applications')
                .then((response) => {
                    console.log('Fetched applications:', response.data);
                    setJobApplications(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching applications:', error);
                    toast.error(`Failed to fetch job applications: ${error.message}`);
                });
        }
    }, [session]);

    const handleRemove = () => {
        if (jobToDelete) {
            axios
                .delete(`/api/applications/${jobToDelete._id}`)
                .then(() => {
                    toast.success('Job application deleted successfully');
                    setJobApplications((prev) => prev.filter((job) => job._id !== jobToDelete._id));
                })
                .catch((error) => {
                    toast.error(`Failed to delete job application: ${error.message}`);
                });
            setIsDeleteModalOpen(false);
            setJobToDelete(null);
        }
    };

    const handleOpenInsightsModal = (jobApplication: JobApplication | null) => {
        setSelectedJobApplication(jobApplication);
        setIsInsightsModalOpen(true);
    };

    const handleOpenDeleteModal = (jobApplication: JobApplication) => {
        setJobToDelete(jobApplication);
        setIsDeleteModalOpen(true);
    };

    const handleDrop = (item: JobApplication, status: string) => {
        if (item.status !== status) {
            axios
                .put(`/api/applications/${item._id}`, {status})
                .then(() => {
                    setJobApplications((prev) =>
                        prev.map((job) => (job._id === item._id ? {...job, status} : job))
                    );
                    toast.success('Job application updated successfully');
                })
                .catch((error) => {
                    toast.error(`Failed to update job application: ${error.message}`);
                });
        }
    };

    const columns = [
        {title: 'Not Applied', status: 'Not Applied'},
        {title: 'Applied', status: 'Applied'},
        {title: 'Interviewing', status: 'Interviewing'},
        {title: 'Offered', status: 'Offered'},
        {title: 'Unsuccessful', status: 'Unsuccessful'},
    ];

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="max-h-[80vh] overflow-hidden">
                <div className="text-center">
                    <div className="flex space-x-4 overflow-x-auto py-4">
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.status}
                                status={column.status}
                                title={column.title}
                                applications={jobApplications.filter((job) => job.status === column.status)}
                                onDrop={handleDrop}
                                onOpenModal={onOpenModal}
                                handleOpenInsightsModal={handleOpenInsightsModal}
                                handleOpenDeleteModal={handleOpenDeleteModal}
                            />
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
        </DndProvider>
    );
};

const KanbanColumn: React.FC<{
    status: string;
    title: string;
    applications: JobApplication[];
    onDrop: (item: JobApplication, status: string) => void;
    onOpenModal: (jobApplication: JobApplication | null) => void;
    handleOpenInsightsModal: (jobApplication: JobApplication | null) => void;
    handleOpenDeleteModal: (jobApplication: JobApplication) => void;
}> = ({status, title, applications, onDrop, onOpenModal, handleOpenInsightsModal, handleOpenDeleteModal}) => {
    const [, drop] = useDrop({
        accept: 'application',
        drop: (item: JobApplication) => onDrop(item, status),
    });

    return (
        <div
            // @ts-ignore
            ref={drop}
            className="bg-gray-200 rounded-lg flex-1 min-w-[250px] max-h-[80vh] overflow-auto"
        >
            <div className="sticky top-0 bg-gray-200 z-10 p-4 border-b border-gray-300">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
            </div>
            <div className="p-4 space-y-4">
                {applications.map((application) => (
                    <KanbanItem
                        key={application._id}
                        application={application}
                        onOpenModal={onOpenModal}
                        handleOpenInsightsModal={handleOpenInsightsModal}
                        handleOpenDeleteModal={handleOpenDeleteModal}
                    />
                ))}
            </div>
        </div>
    );
};

const KanbanItem: React.FC<{
    application: JobApplication;
    onOpenModal: (jobApplication: JobApplication | null) => void;
    handleOpenInsightsModal: (jobApplication: JobApplication | null) => void;
    handleOpenDeleteModal: (jobApplication: JobApplication) => void;
}> = ({application, onOpenModal, handleOpenInsightsModal, handleOpenDeleteModal}) => {
    const [{isDragging}, drag] = useDrag({
        type: 'application',
        item: {...application},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const style = {
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            // @ts-ignore
            ref={drag}
            style={style}
            className="bg-white rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
            <div className="flex justify-between items-center mb-2">
                <div className="text-left">
                    <div className="font-bold text-lg">
                        {application.company} {application.isFavorite && <StarIcon className="text-yellow-500"/>}
                    </div>
                    <div className="text-gray-600">{application.role}</div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleOpenInsightsModal(application)}
                        className="text-white w-8 h-8 p-1 rounded-full flex items-center justify-center bg-green-500 hover:bg-green-600 hover:border-green-600 border-2 border-transparent active:bg-transparent active:text-green-500 active:border-green-500"
                    >
                        <MagicIcon/>
                    </button>
                    <button
                        onClick={() => onOpenModal(application)}
                        className="text-white w-8 h-8 p-1 rounded-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 border-2 border-transparent active:bg-transparent active:text-yellow-500 active:border-yellow-500"
                    >
                        <EyeIcon/>
                    </button>
                    <button
                        onClick={() => handleOpenDeleteModal(application)}
                        className="text-white w-8 h-8 p-1 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 hover:border-red-600 border-2 border-transparent active:bg-transparent active:text-red-500 active:border-red-500"
                    >
                        <DeleteIcon/>
                    </button>
                </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {application.tags?.map((tag) => (
                    <span key={tag} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1">
            {tag}
          </span>
                ))}
            </div>
        </div>
    );
};

export default JobApplicationsKanban;