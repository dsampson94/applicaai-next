import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import useJobApplicationsStore from '../lib/store/jobApplicationsStore';
import useUserStore from '../lib/store/userStore';
import { IApplication } from '../lib/models/Application';

const tabs = [
    { label: 'Mock Interview', value: 'mockInterview' },
    { label: 'Suitability', value: 'suitability' },
    { label: 'Tips', value: 'tips' },
];

interface InsightsModalProps {
    application: IApplication | null;
    onClose: () => void;
}

const InsightsModal: React.FC<InsightsModalProps> = ({ application, onClose }) => {
    const [insights, setInsights] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [requestType, setRequestType] = useState<string>('mockInterview');
    const [typewriterComplete, setTypewriterComplete] = useState<boolean>(false);
    const responseContainerRef = useRef<HTMLDivElement>(null);
    const { user, fetchUser } = useUserStore();
    const { updateApplication, fetchApplications } = useJobApplicationsStore();

    const [responses, setResponses] = useState<string[]>(application?.[`${ requestType }Responses`] || []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (application) {
            setResponses(application[`${ requestType }Responses`] || []);
        }
    }, [application, requestType]);

    const fetchInsights = async (type: string) => {
        if (application && application.jobSpecUrl && user?.userCVUrl) {
            setLoading(true);
            setTypewriterComplete(false);
            try {
                const dataToSend = {
                    jobSpecUrl: application.jobSpecUrl,
                    userCvUrl: user.userCVUrl,
                    type
                };
                const response = await axios.post('/api/insights', dataToSend);
                setLoading(false);
                setInsights(response.data);
            } catch (error) {
                setLoading(false);
                toast.error(`Failed to fetch insights: ${ error.message }`);
            }
        }
    };

    const handleTabClick = (type: string) => {
        setRequestType(type);
        setInsights(null);
        setResponses(application?.[`${ type }Responses`] || []);
    };

    const handleRemoveResponse = async (index: number) => {
        if (!application) return;

        const updatedResponses = responses.slice();
        updatedResponses.splice(index, 1);

        const updates = {
            [`${ requestType }Responses`]: updatedResponses,
        };

        try {
            await updateApplication(application.id, updates);
            toast.success('Response removed successfully');
            setResponses(updatedResponses); // Update local state
            await fetchApplications(); // Fetch latest state
        } catch (error) {
            toast.error(`Failed to remove response: ${ error.message }`);
        }
    };

    const handleAddResponse = async () => {
        if (!application || !insights) return;

        const updatedResponses = [
            ...responses,
            insights,
        ];

        const updates = {
            [`${ requestType }Responses`]: updatedResponses,
        };

        try {
            await updateApplication(application.id, updates);
            toast.success('Response saved successfully');
            setResponses(updatedResponses); // Update local state
            setInsights(null); // Clear the new response
            setTypewriterComplete(false); // Reset typewriter state
            await fetchApplications(); // Fetch latest state
        } catch (error) {
            toast.error(`Failed to save response: ${ error.message }`);
        }
    };

    useEffect(() => {
        if (responseContainerRef.current) {
            responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
        }
    }, [insights, requestType, responses]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded shadow-md w-[90%] h-[90%] flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="grid grid-cols-4 gap-72 mb-4">
                        <div className="space-y-2">
                            <h6 className="text-xl font-semibold whitespace-nowrap">My AI Insights for Application:</h6>
                        </div>
                        <div className="space-y-2">
                            <h6 className="text-xl font-semibold whitespace-nowrap">Company: { application?.company || 'N/A' }</h6>
                            <h6 className="text-xl font-semibold whitespace-nowrap">Role: { application?.role || 'N/A' }</h6>
                        </div>
                        <div className="space-y-2">
                            <h6 className="text-xl font-semibold whitespace-nowrap">CV: { user?.userCVName || 'N/A' }</h6>
                            <h6 className="text-xl font-semibold whitespace-nowrap">Job
                                Spec: { application?.jobSpecName || 'N/A' }</h6>
                        </div>
                    </div>
                    <div className="flex justify-end items-start">
                        <button onClick={ onClose } className="text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex mb-4 border-b-2">
                    { tabs.map(tab => (
                        <button
                            key={ tab.value }
                            onClick={ () => handleTabClick(tab.value) }
                            className={ `px-4 py-2 ${ requestType === tab.value ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' }` }
                        >
                            { tab.label }
                        </button>
                    )) }
                </div>
                <div ref={ responseContainerRef }
                     className="flex-grow overflow-y-auto bg-gray-100 p-4 rounded grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <h6 className="text-xl font-semibold mb-2">Saved Responses:</h6>
                        { responses.map((response, index) => (
                            <div key={ index } className="mb-2 p-2 border border-gray-300 rounded bg-white relative">
                                <pre className="whitespace-pre-wrap">{ response }</pre>
                                <button onClick={ () => handleRemoveResponse(index) }
                                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        )) }
                    </div>
                    <div className="space-y-4">
                        <h6 className="text-xl font-semibold mb-2">New Response:</h6>
                        { loading ? (
                            <p>Loading...</p>
                        ) : (
                            insights && (
                                <div className="p-2 border border-gray-300 rounded bg-white relative">
                                    <pre className="whitespace-pre-wrap">
                                        { typeof insights === 'string' && (
                                            <Typewriter
                                                words={ [insights] }
                                                loop={ 1 } // Ensure it doesn't restart
                                                cursor
                                                cursorStyle="_"
                                                typeSpeed={ 20 }
                                                deleteSpeed={ 0 }
                                                delaySpeed={ 0 }
                                            />
                                        ) }
                                    </pre>
                                    <button onClick={ handleAddResponse }
                                            className="absolute top-0 right-0 p-1 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none">
                                        Add
                                    </button>
                                </div>
                            )
                        ) }
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <button onClick={ () => fetchInsights(requestType) }
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">
                        Get Insights
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsightsModal;
