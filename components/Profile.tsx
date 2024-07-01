import React, { useState, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState({
        userId: '', // Replace with actual user ID
        name: '',
        email: '',
        cvs: [] as { name: string; url: string }[],
    });
    const [newCV, setNewCV] = useState<File | null>(null);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewCV(file);
        }
    };

    const handleAddCV = () => {
        if (newCV) {
            const formData = new FormData();
            formData.append('cv', newCV);

            axios.post('/api/users/uploadCV', formData).then((response) => {
                if (response.status === 200) {
                    const { name, url } = response.data;
                    setProfile((prevState) => ({
                        ...prevState,
                        cvs: [...prevState.cvs, { name, url }],
                    }));
                    toast.success('CV uploaded successfully');
                } else {
                    toast.error('Failed to upload CV');
                }
            });
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
            const response = await axios.put('/api/users/updateProfile', profile);
            if (response.status === 200) {
                toast.success('Profile updated successfully');
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error(`Failed to update profile: ${error.message}`);
        }
    };

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
                        {profile?.cvs.length > 0 && (
                            <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {profile?.cvs.map((cv, index) => (
                                    <div key={index} className="mb-2 border p-2 rounded overflow-hidden px-8">
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
