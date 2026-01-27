import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    emailStatus:false,
    otpStatus:false,
    emaildata:null,
    verifyUser:false,
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
        },
        setVerifyUser: (state, action) => {
            state.verifyUser = true;
        },
        resetVerifyUser: (state, action) => {
            state.verifyUser = false;
        },
    }
})

export const {setEmail, resetEmail, setOtp, resetOtp, setVerifyUser, resetVerifyUser} = emailSlice.actions;
export default emailSlice.reducer;