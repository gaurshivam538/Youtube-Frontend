
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice"
import uploadReducer from "./upload.slice"

const store = configureStore({
    reducer: {
        auth:authReducer,
        upload:uploadReducer,
    }
})

export default store;
