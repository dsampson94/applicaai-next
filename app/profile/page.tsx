'use client'

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface CV {
    name: string;
    url: string;
}

interface UserProfile {
    userId: string;
    name: string;
    cvs: CV[];
}

const Profile: React.FC = () => {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<UserProfile>({
        userId: '',
        name: '',
        cvs: [],
    });
    const [newCV, setNewCV] = useState<CV | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            fetchUserProfile(session.user.id);
        }
    }, [session, status]);

    const fetchUserProfile = async (userId: string) => {
        try {
            const response = await axios.get<UserProfile>(`/api/userProfiles/${userId}`);
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setNewCV({ name: file.name, url: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCV = () => {
        if (newCV) {
            setProfile((prevState) => ({
                ...prevState,
                cvs: [...prevState.cvs, newCV],
            }));
            setNewCV(null);
        }
    };

    const handleRemoveCV = (cvName: string) => {
        setProfile((prevState) => ({
            ...prevState,
            cvs: prevState.cvs.filter((cv) => cv.name !== cvName),
        }));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfile((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put('/api/userProfiles', profile);
            if (response.status === 200) {
                toast.success('Profile updated successfully');
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error: any) {
            toast.error(`Failed to update profile: ${error.message}`);
        }
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'unauthenticated') {
        return <p>Please sign in to view your profile</p>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">My Profile</h1>
                <div className="bg-white p-2 rounded w-full flex flex-1 flex-wrap overflow-hidden">
                    <div className="w-full lg:w-1/3 flex flex-col">
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="email"
                            name="email"
                            value={session?.user?.email || ''}
                            readOnly
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
                        {profile.cvs.length > 0 && (
                            <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {profile.cvs.map((cv) => (
                                    <div key={cv.name} className="mb-2 border p-2 rounded overflow-hidden px-8">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-blue-500">{cv.name}</span>
                                            <button
                                                onClick={() => handleRemoveCV(cv.name)}
                                                className="bg-red-500 text-white px-2 py-1 rounded border-2 border-transparent hover:bg-red-600 hover:border-red-600 active:bg-transparent active:text-red-500 active:border-red-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="h-64 overflow-y-auto">
                                            <iframe
                                                src={`${cv.url}`}
                                                className="w-full h-full border border-gray-300"
                                                title={cv.name}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
