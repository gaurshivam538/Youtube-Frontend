import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    emailStatus:false,
    otpStatus:false,
    emaildata:null,
};

const emailSlice = createSlice({
    name:"email",
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.emailStatus = true;
            state.emaildata = action.payload;
        },
        setOtp: (state, action) => {
            state.otpStatus = true;
        },
        resetOtp: (state, action) => {
            state.otpStatus = false;
        },
        resetEmail: (state, action) => {
            state.emailStatus = false;
            state.emaildata = null;
        }
    }
})

export const {setEmail, resetEmail, setOtp, resetOtp} = emailSlice.actions;
export default emailSlice.reducer;