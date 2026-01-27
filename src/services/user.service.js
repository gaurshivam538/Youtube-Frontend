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

const googleSignup = async (code) => {
    if (!code) {
        console.log("Code can not provide code is required..");
    }
    try {
       const res = await axios.post(`/api/v1/users/google-register`, {
        code
       },
       {
        headers: {"Content-Type": "application/json"}
       }
    
    ) 
    return res;

    } catch (error) {
       console.log(error); 
    }
}

const googleLogin = async (code) => {
    try {
        const res = await axios.post(`/api/v1/users/google-login`,
            {
                code
            },
        )

        return res;
        
    } catch (error) {
        console.log("Error for googleLogin",error);
    }
}

const afterSignupRedirectlogin = async(email) => {
    try {
        if (!email) {
            console.log("Email cannot provide");
        }

        const res = await axios.post(`/api/v1/users/after-googlesignup-rediretlogin`,
            {
                email
            }
        )

        console.log(res);
        return res;
        
    } catch (error) {
        console.log("Error for redirectiongooglelogin", error)
    }
}

const Login = async (email, password) => {
    try {
        const response = await axios.post(`/api/v1/users/login`,
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
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
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

const forgotPassword = async (email) => {
    if (!email) {
        console.log("email can not provided ")
        return
    }
    try {
       
        const res = await axios.post(`api/v1/users/forgot-password`,
            {
                email
            }
        );
        return res;
    } catch (error) {
        return error;
    }
}

const verifyOtp = async(email, otp) => {
    if (!email || !otp) {
        console.log("Email and otp is required for the vefification")
        return;
    }

    try {
        const res = await axios.post(`/api/v1/users/verify-otp`,
            {
                email, otp
            }
        );

        return res;
    } catch (error) {
        console.log(error)
    }
}

const updatePassword = async (email, password) => {
    if (!email || !password) {
        console.log("Email and password is required");
        return;
    }

    try {
        const res = await axios.patch("/api/v1/users/update-password",
            {
                email, password
            },
             {
                withCredentials:true,
            }
        );

        return res;  
    } catch (error) {
       return error;
    }
}

const generateNewAccessToken = async() => {
    try {
        const res = await axios.post(`/refresh-access-token`,
            {
                withCredentials: true,
            }
        );
        console.log("AccessToken response", res);
        return res;
    } catch (error) {
        console.log(error)
    }
}

export {
    SignUp,
    Login,
    Logout,
    Userprofile,
    userDashboard,
    googleSignup,
    googleLogin,
    afterSignupRedirectlogin,
    forgotPassword,
    verifyOtp,
    updatePassword,
    generateNewAccessToken
}