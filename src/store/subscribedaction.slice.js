import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subscribedCount: 0,
};

const subscribeSlice = createSlice({
    name: "subscribe",
    initialState,
    reducers: {

        setSubscribedCount: (state, action) => {
            state.subscribedCount = action.payload;
        },

        incrementCount: (state) => {
            state.subscribedCount += 1;
        },

        decrementCount: (state) => {
            state.subscribedCount -= 1;
        }
    }
});

export const {
    setSubscribedCount,
    incrementCount,
    decrementCount
} = subscribeSlice.actions;

export default subscribeSlice.reducer;
