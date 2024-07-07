import {create} from 'zustand';
import axios from 'axios';
import {getAuthHeaders} from '../../../auth';
import {User} from '../../../types';

interface UserStore {
    user: User | null;
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    updateUser: (user: Partial<User>) => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    loading: false,
    error: null,
    fetchUser: async () => {
        set({loading: true, error: null});
        try {
            const headers = getAuthHeaders();
            const response = await axios.get<User>
            (`/api/users`, {headers});
            set({user: response.data, loading: false});
        } catch (error: any) {
            set({error: error.message, loading: false});
        }
    },
    updateUser: async (user: Partial<User>) => {
        set({loading: true, error: null});
        try {
            const headers = getAuthHeaders();
            const response = await axios.put<User>
            (`/api/users`, user, {headers});
            set({user: response.data, loading: false});
        } catch (error: any) {
            set({error: error.message, loading: false});
        }
    },
}));

export default useUserStore;
