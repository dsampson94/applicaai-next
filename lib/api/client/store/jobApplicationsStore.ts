// src/lib/api/client/store/jobApplicationsStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { Application } from '../../../../prisma/generated/prisma';
import { ENDPOINT } from '../../../constants';

interface JobApplicationsState {
    applications: Application[];
    loading: boolean;
    error: string | null;
    fetchApplications: (token: string) => Promise<void>;
    addApplication: (application: Omit<Application, 'id'>, token: string) => Promise<void>;
    updateApplication: (id: string, updates: Partial<Application>, token: string) => Promise<void>;
    deleteApplication: (id: string, token: string) => Promise<void>;
}

const useJobApplicationsStore = create<JobApplicationsState>((set) => ({
    applications: [],
    loading: false,
    error: null,
    fetchApplications: async (token: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get<Application[]>(`/api/${ENDPOINT.APPLICATIONS}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ applications: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    addApplication: async (application: Omit<Application, 'id'>, token: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post<Application>(`/api/${ENDPOINT.APPLICATIONS}`, application, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set((state) => ({
                applications: [...state.applications, response.data],
                loading: false,
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    updateApplication: async (id: string, updates: Partial<Application>, token: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put<Application[]>(`/api/${ENDPOINT.APPLICATIONS}/${id}`, updates, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ applications: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    deleteApplication: async (id: string, token: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.delete<Application[]>(`/api/${ENDPOINT.APPLICATIONS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ applications: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default useJobApplicationsStore;
