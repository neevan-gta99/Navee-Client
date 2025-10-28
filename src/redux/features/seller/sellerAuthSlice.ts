import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from '@/config/apiConfig';


interface SellerAuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    sellerData: any;
    loginTimestamp: number | null;
}

const initialState: SellerAuthState = {
    isAuthenticated: false,
    loading: false,
    error: null,
    sellerData: null,
    loginTimestamp: null,
};


export const fetchSellerAuth = createAsyncThunk(
    'sellerAuth/fetchSellerAuth',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/api/seller/authentication`, {
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

export const logoutSellerSession = createAsyncThunk(
    'sellerAuth/logoutSellerSession',
    async (_, { dispatch }) => {
        try {
            const res = await fetch(`${BASE_URL}/seller/logout`, {
                method: 'POST',
                credentials: 'include',
            });


            if (res.ok) {
                dispatch(logoutSeller());
            }
        } catch (err) {
            dispatch(logoutSeller());
        }
    }
);



const sellerAuthSlice = createSlice({
    name: 'sellerAuth',
    initialState,
    reducers: {
        logoutSeller: (state) => {
            state.isAuthenticated = false;
            state.sellerData = null;
            state.loginTimestamp = null; // if you're tracking login time
            state.error = null;
        },
        setLoginSession: (
            state,
            action: PayloadAction<{ timestamp: number; sellerId: string }>
        ) => {
            state.loginTimestamp = action.payload.timestamp;
            state.sellerData = { sellerId: action.payload.sellerId };
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerAuth.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.sellerData = action.payload;
            })
            .addCase(fetchSellerAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.sellerData = null;
            });
    },
});


export const { logoutSeller, setLoginSession } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;
