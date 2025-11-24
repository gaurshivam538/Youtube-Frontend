import axios from "axios";

const serverUrl = import.meta.env.VITE_BACKEND_SERVER_URL;
console.log(serverUrl);
const SignUp = (username, email, fullName, password, avatar) => {
    try {
        const response = axios.post(`${serverUrl}/register`,
            { username, email, fullName, password, avatar },
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        )

        return response;
    } catch (error) {
        console.log("Signup error:", error.response?.data || error.message)
    }

}

const Login = (email, password) => {
    try {
        const response = axios.post(`${serverUrl}/login`,
            { email, password },
            { withCredentials: true },
            {
                headers: { "Content-Type": "application/json" }
            }
        )
       
        return response;
    } catch (error) {
        console.log("Login error:", error.response?.data || error.massage)
    }
}

export {
    SignUp,
    Login
}