import axios from "axios";

const serverUrl = import.meta.env.VITE_BACKEND_SERVER_URL;

const SignUp = async (username, email, fullName, password, avatar) => {
    try {
        const response = await axios.post(`${serverUrl}/register`,
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

const Login = async (email, password) => {
    try {
        const response = await axios.post(`${serverUrl}/login`,
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

const Logout = async () => {
    try {
        await axios.post(
            `${serverUrl}/logout`,
            {},
            {
                withCredentials: true, // VERY IMPORTANT FOR COOKIE TOKEN
            }
        );

    } catch (error) {
        console.log("Logout error")
    }
}

const Userprofile = async () => {
    try {
        const response = await axios.get(
            `${serverUrl}/profile-image`,
            {
                withCredentials: true,
            }
        );
        
        return response;
    } catch (error) {
        throw error;
    }
}

export {
    SignUp,
    Login,
    Logout,
    Userprofile
}