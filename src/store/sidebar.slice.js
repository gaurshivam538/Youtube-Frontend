import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSidebarOpen: false,
};

const sidebarSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        openSidebar: (state) => {
            state.isSidebarOpen = true;
        },
        closeSidebar: (state) => {
            state.isSidebarOpen = false;
        }
    }
});

export default sidebarSlice.reducer;
export const {
    toggleSidebar,
    openSidebar,
    closeSidebar
} = sidebarSlice.actions;