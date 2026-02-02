import {createSlice} from "@reduxjs/toolkit"
const getUserData =localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")) :null;

const initialState = {
    status: true,
    userData: getUserData,
}


const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state, action) => {
            state.status = false;
            state.userData = null;
        }
    }

})

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
