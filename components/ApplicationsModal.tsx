import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useJobApplicationsStore from '../lib/store/jobApplicationsStore';
import useUserStore from '../lib/store/userStore';
import { useDropzone } from 'react-dropzone';
import { IApplication } from '../lib/models/Application';

interface JobApplicationModalProps {
    application?: IApplication | null;
    onClose: () => void;
}

const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'Not Applied', label: 'Not Applied' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Interviewing', label: 'Interviewing' },
    { value: 'Offered', label: 'Offered' },
    { value: 'Rejected', label: 'Rejected' },
];

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ application, onClose }) => {
    const [role, setRole] = useState(application?.role || '');
    const [company, setCompany] = useState(application?.company || '');
    const [status, setStatus] = useState(application?.status || 'Not Applied');
    const [jobSpecUrl, setJobSpecUrl] = useState<string | undefined>(application?.jobSpecUrl || undefined);
    const [jobSpecName, setJobSpecName] = useState<string | undefined>(application?.jobSpecName || undefined);
    const [cvName, setCvName] = useState<string | undefined>(application?.cvName || undefined);
    const [contactEmail, setContactEmail] = useState(application?.contactEmail || '');
    const [tags, setTags] = useState<string[]>(application?.tags || []);
    const [newTag, setNewTag] = useState<string>('');

    const { user, fetchUser } = useUserStore();
    const { addApplication, updateApplication } = useJobApplicationsStore();

    useEffect(() => {
        fetchUser();
        if (application) {
            setRole(application.role || '');
            setCompany(application.company || '');
            setStatus(application.status || 'Not Applied');
            setJobSpecUrl(application.jobSpecUrl || undefined);
            setJobSpecName(application.jobSpecName || undefined);
            setCvName(application.cvName || undefined);
            setContactEmail(application.contactEmail || '');
            setTags(application.tags || []);
        }
    }, [application, fetchUser, user?._id]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setJobSpecUrl(base64String);
                setJobSpecName(file.name);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // @ts-ignore
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'application/pdf' });

    const handleAddTag = () => {
        if (newTag.trim() !== '') {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleSubmit = async () => {
        const updates = {
            role,
            company,
            status,
            jobSpecUrl,
            jobSpecName,
            cvName,
            tags,
            userEmail: user?.email,
            contactEmail,
        };

        try {
            if (application) {
                await updateApplication(application._id, updates);
                toast.success('Job application updated successfully');
            } else {
                await addApplication(updates as unknown as Omit<IApplication, '_id'>);
                toast.success('Job application created successfully');
            }

            onClose();
        } catch (error: any) {
            toast.error(`Failed to save job application: ${error.message}`);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl my-12 grid grid-cols-2 gap-8">
                <div className="col-span-2 sm:col-span-1">
                    <h2 className="text-2xl mb-4">{application ? 'Update Job Application' : 'Create Job Application'}</h2>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Role"
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company"
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <label className="block mb-2">CV:</label>
                    <select
                        value={cvName || ''}
                        onChange={(e) => setCvName(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    >
                        <option value={user?.userCVName || ''}>
                            {user?.userCVName || 'Select CV'}
                        </option>
                    </select>
                    <label className="block mb-2">Contact Email:</label>
                    <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Contact Email"
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <label className="block mb-2">Job Spec:</label>
                    <div {...getRootProps({ className: 'dropzone' })} className="mb-4 p-2 border border-gray-300 rounded w-full text-center cursor-pointer">
                        <input {...getInputProps()} />
                        {jobSpecName ? (
                            <p>{jobSpecName}</p>
                        ) : (
                            <p>Drag & drop a Job Spec here, or click to select a file</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Tags:</label>
                        <div className="flex flex-wrap mb-2">
                            {tags.map((tag) => (
                                <div key={tag} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2 flex items-center">
                                    <span>{tag}</span>
                                    <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-red-500">
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="New Tag"
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <button onClick={handleAddTag} className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-transparent hover:bg-blue-600 hover:border-blue-600 active:bg-transparent active:text-blue-500 active:border-blue-500">
                            Add Tag
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2 border-2 border-transparent hover:bg-gray-600 hover:border-gray-600 active:bg-transparent active:text-gray-500 active:border-gray-500">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-transparent hover:bg-blue-600 hover:border-blue-600 active:bg-transparent active:text-blue-500 active:border-blue-500">
                            {application ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
                <div className="col-span-2 sm:col-span-1 flex flex-col space-y-4">
                    {user?.userCVUrl && (
                        <div>
                            <h3 className="mb-2">User CV:</h3>
                            <iframe
                                src={user.userCVUrl}
                                title="User CV"
                                className="w-full h-64 mb-4 border border-gray-300"
                            />
                        </div>
                    )}
                    {jobSpecUrl && (
                        <div>
                            <h3 className="mb-2">Job Spec:</h3>
                            <iframe
                                src={jobSpecUrl}
                                title="Job Spec Preview"
                                className="w-full h-64 mb-4 border border-gray-300"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobApplicationModal;
