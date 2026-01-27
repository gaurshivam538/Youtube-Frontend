
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

// 📝 Keep Redux state and localStorage in sync
// This listener runs every time the Redux store changes.
// If the user is logged in, save user data to localStorage
// so it persists across page reloads. If the user logs out,
// remove the user from localStorage to avoid stale data.
store.subscribe(() => {
    const state= store.getState();

    if (state?.auth?.userData) {
        localStorage.setItem("user", JSON.stringify(state?.auth?.userData))
    } else {
        localStorage.removeItem("user");
    }
})

export default store;
