// src/lib/api/client/store/userProfileStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { UserProfile } from '../../../../prisma/generated/prisma';
import { ENDPOINT } from '../../../constants';

interface CV {
    name: string;
    url: string;
}

interface UserProfileState {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    fetchProfile: (userId: string) => Promise<void>;
    updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const useUserProfileStore = create<UserProfileState>((set) => ({
    profile: null,
    loading: false,
    error: null,
    fetchProfile: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get<UserProfile>(`/api/${ENDPOINT.USERPROFILES}/${userId}`);
            set({ profile: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    updateProfile: async (profile: Partial<UserProfile>) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put<UserProfile>(`/api/${ENDPOINT.USERPROFILES}`, profile);
            set({ profile: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default useUserProfileStore;
