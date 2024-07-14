import { create } from 'zustand';
import axios from 'axios';
import { getAuthHeaders } from '../auth';
import { IApplication } from '../models/Application';
import { Types } from 'mongoose';

interface JobApplicationsState {
    applications: IApplication[];
    loading: boolean;
    error: string | null;
    fetchApplications: () => Promise<void>;
    addApplication: (application: Partial<IApplication>) => Promise<void>;
    updateApplication: (id: Types.ObjectId, updates: Partial<IApplication>) => Promise<void>;
    deleteApplication: (id: Types.ObjectId) => Promise<void>;
}

const useJobApplicationsStore = create<JobApplicationsState>((set) => ({
    applications: [],
    loading: false,
    error: null,
    fetchApplications: async () => {
        set({ loading: true, error: null });
        try {
            const headers = getAuthHeaders();
            const response = await axios.get<IApplication[]>('/api/applications', { headers });
            set({ applications: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    addApplication: async (application: Partial<IApplication>) => {
        set({ loading: true, error: null });
        try {
            const headers = getAuthHeaders();
            await axios.post<IApplication>('/api/applications', application, { headers });
            const updatedApplications = await axios.get<IApplication[]>('/api/applications', { headers });
            set({ applications: updatedApplications.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    updateApplication: async (id: Types.ObjectId, updates: Partial<IApplication>) => {
        set({ loading: true, error: null });
        try {
            const headers = getAuthHeaders();
            await axios.put<IApplication>(`/api/applications/${id}`, updates, { headers });
            const updatedApplications = await axios.get<IApplication[]>('/api/applications', { headers });
            set({ applications: updatedApplications.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    deleteApplication: async (id: Types.ObjectId) => {
        set({ loading: true, error: null });
        try {
            const headers = getAuthHeaders();
            await axios.delete(`/api/applications/${id}`, { headers });
            const updatedApplications = await axios.get<IApplication[]>('/api/applications', { headers });
            set({ applications: updatedApplications.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default useJobApplicationsStore;
