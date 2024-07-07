'use client';

import React, {ChangeEvent, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import useUserStore from '../../lib/api/client/store/userStore';

const Profile: React.FC = () => {
    const {user, fetchUser, updateUser} = useUserStore();
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

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setNewCV({name: file.name, url: base64String});
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCV = () => {
        if (newCV) {
            setProfile((prevState) => ({
                ...prevState,
                userCVName: newCV.name,
                userCVUrl: newCV.url,
            }));
            setNewCV(null);
        }
    };

    const handleRemoveCV = () => {
        setProfile((prevState) => ({
            ...prevState,
            userCVName: '',
            userCVUrl: '',
        }));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setProfile((prevState) => ({...prevState, [name]: value}));
    };

    const handleSubmit = async () => {
        try {
            await updateUser({...profile});
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error(`Failed to update profile: ${error.message}`);
        }
    };

    return (
        <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">My Profile</h1>
            <div className="bg-white p-2 rounded w-full flex flex-1 flex-wrap overflow-hidden">
                <div className="w-full lg:w-1/3 flex flex-col">
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
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />
                    <div className="flex justify-between items-center w-full">
                        <button
                            onClick={handleAddCV}
                            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-1/2 mr-2 border-2 border-transparent hover:bg-blue-600 hover:border-blue-600 active:bg-transparent active:text-blue-500 active:border-blue-500"
                        >
                            Add CV
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-1/2 ml-2 border-2 border-transparent hover:bg-blue-600 hover:border-blue-600 active:bg-transparent active:text-blue-500 active:border-blue-500"
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
                <div className="w-full lg:w-2/3 pl-8 h-full overflow-y-auto">
                    {profile.userCVName && profile.userCVUrl && (
                        <div className="mb-4 border p-2 rounded overflow-hidden">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-blue-500">{profile.userCVName}</span>
                                <button
                                    onClick={handleRemoveCV}
                                    className="bg-red-500 text-white px-2 py-1 rounded border-2 border-transparent hover:bg-red-600 hover:border-red-600 active:bg-transparent active:text-red-500 active:border-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="h-64 overflow-y-auto">
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