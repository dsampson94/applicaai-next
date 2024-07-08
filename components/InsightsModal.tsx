import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Typewriter } from 'react-simple-typewriter';
import {
    Box,
    Button,
    Typography,
    Tabs,
    Tab,
    Paper,
    IconButton,
    Modal,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import {Application} from "../prisma/generated/prisma";

const tabs = [
    { label: 'Mock Interview', value: 'mockInterview' },
    { label: 'Suitability', value: 'suitability' },
    { label: 'Tips', value: 'tips' },
];

interface InsightsModalProps {
    application: Application | null;
    onClose: () => void;
}

const InsightsModal: React.FC<InsightsModalProps> = ({ application, onClose }) => {
    const [insights, setInsights] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [requestType, setRequestType] = useState<string>('mockInterview');
    const responseContainerRef = useRef<HTMLDivElement>(null);
    const [responses, setResponses] = useState<string[]>(application?.[`${requestType}Responses`] || []);

    const fetchInsights = async (type: string) => {
        if (application && application.jobSpecUrl && application.cvName) {
            setLoading(true);
            try {
                const response = await axios.post('/api/getInsights', { jobSpec: application.jobSpecUrl, cvName: application.cvName, type });
                setLoading(false);
                setInsights(response.data);
            } catch (error) {
                setLoading(false);
                toast.error(`Failed to fetch insights: ${error.message}`);
            }
        }
    };

    const handleTabClick = (type: string) => {
        setRequestType(type);
        setInsights(null);
        setResponses(application?.[`${type}Responses`] || []);
    };

    const handleRemoveResponse = async (index: number) => {
        if (!application) return;

        const updatedResponses = responses.slice();
        updatedResponses.splice(index, 1);

        const updates = {
            [`${requestType}Responses`]: updatedResponses,
        };

        try {
            await axios.put(`/api/applications/${application.id}`, updates);
            toast.success('Response removed successfully');
            setResponses(updatedResponses); // Update local state
        } catch (error) {
            toast.error(`Failed to remove response: ${error.message}`);
        }
    };

    const handleAddResponse = async () => {
        if (!application || !insights) return;

        const updatedResponses = [
            ...responses,
            insights,
        ];

        const updates = {
            [`${requestType}Responses`]: updatedResponses,
        };

        try {
            await axios.put(`/api/applications/${application.id}`, updates);
            toast.success('Response saved successfully');
            setResponses(updatedResponses); // Update local state
            setInsights(null); // Clear the new response
        } catch (error) {
            toast.error(`Failed to save response: ${error.message}`);
        }
    };

    useEffect(() => {
        if (responseContainerRef.current) {
            responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
        }
    }, [insights, requestType]);

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
            <Paper className="p-6 rounded shadow-md w-[90%] h-[90%] flex flex-col">
                <Box className="grid grid-cols-2 gap-4 mb-4">
                    <Box className="grid grid-cols-4 gap-72 mb-4">
                        <Box className="space-y-2">
                            <Typography variant="h6" className="font-semibold">My AI Insights for Application:</Typography>
                        </Box>
                        <Box className="space-y-2">
                            <Typography variant="h6" className="font-semibold">Company: {application?.company || 'N/A'}</Typography>
                            <Typography variant="h6" className="font-semibold">Role: {application?.role || 'N/A'}</Typography>
                        </Box>
                        <Box className="space-y-2">
                            <Typography variant="h6" className="font-semibold">CV: {application?.cvName || 'N/A'}</Typography>
                            <Typography variant="h6" className="font-semibold">Job Spec: {application?.jobSpecName || 'N/A'}</Typography>
                        </Box>
                    </Box>
                    <Box className="flex justify-end items-start">
                        <IconButton onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Tabs value={requestType} onChange={(event, newValue) => handleTabClick(newValue)} className="flex mb-4 border-b-2">
                    {tabs.map(tab => (
                        <Tab key={tab.value} value={tab.value} label={tab.label} className={requestType === tab.value ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} />
                    ))}
                </Tabs>
                <Box ref={responseContainerRef} className="flex-grow overflow-y-auto bg-gray-100 p-4 rounded grid grid-cols-2 gap-4">
                    <Box className="space-y-4">
                        <Typography variant="h6" className="font-semibold mb-2">Saved Responses:</Typography>
                        {responses.map((response, index) => (
                            <Box key={index} className="mb-2 p-2 border border-gray-300 rounded bg-white relative">
                                <pre className="whitespace-pre-wrap">{response}</pre>
                                <IconButton onClick={() => handleRemoveResponse(index)} className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    <Box className="space-y-4">
                        <Typography variant="h6" className="font-semibold mb-2">New Response:</Typography>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : (
                            insights && (
                                <Box className="p-2 border border-gray-300 rounded bg-white relative">
                                    <pre className="whitespace-pre-wrap">
                                        <Typewriter
                                            words={[insights]}
                                            loop={false}
                                            cursor
                                            cursorStyle="_"
                                            typeSpeed={20}
                                            deleteSpeed={0}
                                            delaySpeed={0}
                                        />
                                    </pre>
                                    <IconButton onClick={handleAddResponse} className="absolute top-0 right-0 p-1 bg-green-500 text-white rounded-full hover:bg-green-600">
                                        Add
                                    </IconButton>
                                </Box>
                            )
                        )}
                    </Box>
                </Box>
                <Box className="flex justify-center mt-4">
                    <Button onClick={() => fetchInsights(requestType)} variant="contained" color="primary">
                        Get Insights
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default InsightsModal;
