import { createSlice } from "@reduxjs/toolkit";

const localDashboard = localStorage.getItem('dashboard');

const initialState = {
    userQueried: false,
    isAuthenticated: false,
    user: null,
    isAdmin: false,
    dashboard: localDashboard ? localDashboard : "user",
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isAdmin = action.payload.role.split(',').includes('ADMIN');
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.isAdmin = false;
        },
        switchDashboard: (state, action) => {
            if(state.isAdmin){
                state.dashboard = action.payload;
                localStorage.setItem('dashboard', action.payload);
            }
        },
        setUserQueried: (state) => {
            state.userQueried = true;
        }
    }
})

export const { login, logout, switchDashboard, setUserQueried } = userSlice.actions;
export default userSlice.reducer;