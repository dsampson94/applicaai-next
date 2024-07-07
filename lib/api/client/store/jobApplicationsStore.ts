import { create } from 'zustand';
import axios from 'axios';
import { Application } from '../../../../prisma/generated/prisma';
import { ENDPOINT } from '../../../constants';
import {getAuthHeaders} from "../../../auth";

interface JobApplicationsState {
    applications: Application[];
    loading: boolean;
    error: string | null;
    fetchApplications: () => Promise<void>;
    addApplication: (application: Omit<Application, 'id'>) => Promise<void>;
    updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
    deleteApplication: (id: string) => Promise<void>;
}

const useJobApplicationsStore = create<JobApplicationsState>((set) => ({
    applications: [],
    loading: false,
    error: null,
    fetchApplications: async () => {
        set({ loading: true, error: null });
        try {
            const headers = getAuthHeaders();
            const response = await axios.get<Application[]>
            (`/api/${ENDPOINT.APPLICATIONS}`, { headers });
            set({ applications: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    addApplication: async (application: Omit<Application, 'id'>) => {
        set({ loading: true, error: null });
        try {
            const headers = getAuthHeaders();
            const response = await axios.post<Application>
            (`/api/${ENDPOINT.APPLICATIONS}`, application, { headers });
            set((state) => ({
                applications: [...state.applications, response.data],
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    updateApplication: async (id: string, updates: Partial<Application>) => {
        set({ loading: true, error: null });
        try {
            const headers = getAuthHeaders();
            const response = await axios.put<Application[]>
            (`/api/${ENDPOINT.APPLICATIONS}/${id}`, updates, { headers });
            set({ applications: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    deleteApplication: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const headers = getAuthHeaders();
            const response = await axios.delete<Application[]>
            (`/api/${ENDPOINT.APPLICATIONS}/${id}`, { headers });
            set({ applications: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default useJobApplicationsStore;
