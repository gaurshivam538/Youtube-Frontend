import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    uploads: [],
}
const uploadSlice = createSlice({
    name: "upload",
    initialState,
    reducers: {
        startUpload: (state, action) => {
            state.uploads.unshift({
                id: action.payload.id,
                title: action.payload.title,
                progress: 0,
                status: "uploading",
                videoId: null,
                error: null,
            })
        },

        updateProgress: (state, action) => {
            const u = state.uploads.find(u => u.id === action.payload.id);
            if (u) {
                u.progress = action.payload.progress;
            }
        },

        uploadComplete: (state, action) => {
            const u = state.uploads.find(u => u.id === action.payload.id);
            if (u) {
                u.progress = 100;
                u.status = "processing";
                u.videoId = action.payload.videoId;
            }
        },

        processingComplete: (state, action) => {
            const u = state.uploads.find(x => x.id === action.payload.id);
            if (u) {
                u.status = "ready";
            }
        },

        uploadFailed: (state, action) => {
            const u = state.uploads.find(x => x.id === action.payload.id);
            if (u) {
                u.status = "error";
                u.error = action.payload.error;
            }
        },

        removeUpload: (state, action) => {
            state.uploads = state.uploads.filter(
                u => u.id !== action.payload
            );
        }
    }

})

export const {
    startUpload,
    updateProgress,
    uploadComplete,
    processingComplete,
    uploadFailed,
    removeUpload
} = uploadSlice.actions;

export default uploadSlice.reducer;