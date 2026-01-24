import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    emailStatus:false,
    otpStatus:false,
    emaildata:null,
    otpdata:null
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
            state.otpdata = action.payload;
        },
        resetOtp: (state, action) => {
            state.otpStatus = false;
            state.otpdata = null;
        },
        resetEmail: (state, action) => {
            state.emailStatus = false;
            state.emaildata = null;
        }
    }
})

export const {setEmail, resetEmail, setOtp, resetOtp} = emailSlice.actions;
export default emailSlice.reducer;