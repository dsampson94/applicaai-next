'use client';

import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import useUserStore from '../../lib/store/userStore';

const Profile: React.FC = () => {
    const { user, fetchUser, updateUser } = useUserStore();
    const initialProfile = {
        username: user?.username || '',
        email: user?.email || '',
        userCVName: user?.userCVName || '',
        userCVUrl: user?.userCVUrl || '',
    };

    const [profile, setProfile] = useState(initialProfile);
    const [newCV, setNewCV] = useState(null);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (user) {
            setProfile({
                username: user.username,
                email: user.email,
                userCVName: user.userCVName || '',
                userCVUrl: user.userCVUrl || '',
            });
        }
    }, [user]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                // @ts-ignore
                setNewCV({name: file.name, url: base64String});
                setProfile((prevState) => ({
                    ...prevState,
                    userCVName: file.name,
                    userCVUrl: base64String,
                }));
                await updateUser({...profile});
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // @ts-ignore
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'application/pdf' });

    const handleRemoveCV = () => {
        setProfile((prevState) => ({
            ...prevState,
            userCVName: '',
            userCVUrl: '',
        }));
        toast.info('CV removed');
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfile((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await updateUser({ ...profile });
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error(`Failed to update profile: ${error.message}`);
        }
    };

    return (
        <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">My Profile</h1>
            <div className="bg-white p-2 rounded w-full flex flex-1 flex-col overflow-hidden">
                <div className="w-full flex flex-col mb-4">
                    <input
                        type="text"
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <div {...getRootProps({ className: 'dropzone' })} className="mb-4 p-2 border border-gray-300 rounded w-full text-center cursor-pointer">
                        <input {...getInputProps()} />
                        <p>Drag & drop a CV here, or click to select a file</p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded w-full ml-2 border-2 border-transparent hover:bg-blue-600 hover:border-blue-600 active:bg-transparent active:text-blue-500 active:border-blue-500"
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
                <div className="w-full h-full overflow-y-auto">
                    {profile.userCVName && profile.userCVUrl && (
                        <div className="mb-4 border p-2 rounded overflow-hidden w-full">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-blue-500">{profile.userCVName}</span>
                                <button
                                    onClick={handleRemoveCV}
                                    className="bg-red-500 text-white px-2 py-1 rounded border-2 border-transparent hover:bg-red-600 hover:border-red-600 active:bg-transparent active:text-red-500 active:border-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="h-96 overflow-y-auto">
                                <iframe
                                    src={profile.userCVUrl}
                                    className="w-full h-full border border-gray-300"
                                    title={profile.userCVName}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
