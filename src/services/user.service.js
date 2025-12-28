import axios from "axios";

// const serverUrl = import.meta.env.VITE_BACKEND_SERVER_URL;

const SignUp = async (username, email, fullName, password, avatar) => {
    try {
        const response = await axios.post(`/api/v1/users/register`,
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
        console.log("Service page",email,password)
        const response = await axios.post(`/api/v1/users/login`,
            { email, password },
            { withCredentials: true },
            {
                headers: { "Content-Type": "application/json" }
            }
        )
        console.log("response",response);

        return response;
    } catch (error) {
        console.log("Login error:", error.response?.data || error.massage)
    }
}

const Logout = async () => {
    try {
        await axios.post(
            `/api/v1/users/logout`,
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
            `/api/v1/users/profile-image`,
            {
                withCredentials: true,
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

const userDashboard = async (username) => {
   try {
    
     const response = await axios.get(
         `/api/v1/users/user-channel-profile/${username}`
     ,
     {withCredentials:true}
     )
     return response;
   } catch (error) {
    console.log("Error call the dashboard api", error)
    return error.response;  // 🔥 return error so you can inspect in React
   }
    
}

export {
    SignUp,
    Login,
    Logout,
    Userprofile,
    userDashboard,
}