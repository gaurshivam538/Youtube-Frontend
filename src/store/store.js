
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice"
import uploadReducer from "./upload.slice"
import emailReducer from "./emailsave.slice"

const store = configureStore({
    reducer: {
        auth:authReducer,
        upload:uploadReducer,
        email: emailReducer
    }
})

export default store;
