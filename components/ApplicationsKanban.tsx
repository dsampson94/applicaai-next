import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import axios from 'axios';
import { IApplication } from '../lib/models/Application';

interface ApplicationsKanbanProps {
    applications: IApplication[];
    onOpenModal: (application: IApplication | null) => void;
    onUpdateApplication: (updatedApplication: IApplication) => void;
}

const ApplicationsKanban: React.FC<ApplicationsKanbanProps> = ({ applications, onOpenModal, onUpdateApplication }) => {
    const columns = [
        { title: 'Not Applied', status: 'Not Applied' },
        { title: 'Applied', status: 'Applied' },
        { title: 'Interviewing', status: 'Interviewing' },
        { title: 'Offered', status: 'Offered' },
        { title: 'Unsuccessful', status: 'Unsuccessful' },
    ];

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;

        const draggedApplication = applications.find((app) => app._id === draggableId);
        if (draggedApplication) {
            const updatedApplication = { ...draggedApplication, status: destination.droppableId };

            // @ts-ignore
            onUpdateApplication(updatedApplication);

            // Update application status in the server
            try {
                await axios.put(`/api/applications/${draggedApplication._id}`, updatedApplication);
            } catch (error) {
                console.error('Failed to update job application:', error);
                // Optionally revert local update if server update fails
                onUpdateApplication(draggedApplication);
            }
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
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
                                        .filter((app) => app.status === column.status)
                                        .map((app, index) => (
                                            <Draggable key={app._id} draggableId={app._id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="text-left">
                                                                <div className="font-bold text-lg">{app.company}</div>
                                                                <div className="text-gray-600">{app.role}</div>
                                                            </div>
                                                            <button
                                                                onClick={() => onOpenModal(app)}
                                                                className="text-white w-8 h-8 p-1 rounded-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 border-2 border-transparent active:bg-transparent active:text-yellow-500 active:border-yellow-500"
                                                            >
                                                                View
                                                            </button>
                                                        </div>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {app.tags.map((tag) => (
                                                                <span key={tag} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1">
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
        </DragDropContext>
    );
};

export default ApplicationsKanban;
