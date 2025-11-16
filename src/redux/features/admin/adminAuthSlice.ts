import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from '@/config/apiConfig.ts';


interface AdminAuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    adminData: any;
    loginTimestamp: number | null;
}

const initialState: AdminAuthState = {
    isAuthenticated: false,
    loading: false,
    error: null,
    adminData: null,
    loginTimestamp: null,
};


export const fetchAdminAuth = createAsyncThunk(
    'adminAuth/fetchAdminAuth',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/authentication`, {
                credentials: 'include',
            });

            if (!res.ok) {
                return rejectWithValue('Unauthorized');
            }

            const data = await res.json();
            return data;
        } catch (err) {
            return rejectWithValue('Network error');
        }
    }
);

export const logoutAdminSession = createAsyncThunk(
    'adminAuth/logoutAdminSession',
    async (_, { dispatch }) => {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                dispatch(logoutAdmin());
            }
        } catch (err) {
            dispatch(logoutAdmin());
        }
    }
);





const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        logoutAdmin: (state) => {
            state.isAuthenticated = false;
            state.adminData = null;
            state.loginTimestamp = null; // if you're tracking login time
            state.error = null;
        },
        setAdminLoginSession: (
            state,
            action: PayloadAction<{ timestamp: number; adminId: string }>
        ) => {
            console.log(action.payload.timestamp);

            state.loginTimestamp = action.payload.timestamp;
            state.adminData = { adminId: action.payload.adminId };
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminAuth.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.adminData = action.payload;
            })
            .addCase(fetchAdminAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.adminData = null;
            });
    },
});


export const { logoutAdmin, setAdminLoginSession } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
