import { useForm } from "react-hook-form"
import {Input, Button} from "./index"
import { updatePassword as serviceUpdatePassword} from "../services/user.service"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { resetEmail, resetVerifyUser } from "../store/emailsave.slice"

export default function UpdatePassword() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
 


    const updatePassword = async (data) =>{
        try {
            const res = await serviceUpdatePassword(data?.email, data?.password)
            console.log(res);
            if (res?.response?.status === 401) {
                alert("Please Write a same email then you are updating the take the otp then written this email")
            }
            if (res?.data?.statusCode === 200) {
                dispatch(resetEmail());
                dispatch(resetVerifyUser())
                navigate("/login");
            }
        } catch (error) {
            console.log("Error",error);
        }
    }

    return (
 <div className=" mt-4 mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 shadow-lg">
        <form onSubmit={handleSubmit(updatePassword)}>
            <div className="flex flex-col">
                <Input
                    lable="Email"
                    placeholder="Enter your email"
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        validate: {
                            matchPattern: (value) =>
                                /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value) ||
                                "Email address must be valid",
                        },
                    })}
                />
                {errors.email && (
                    <p className="text-red-600 mt-4 text-center">{errors.email.message}</p>
                )}
            </div>
            <div className="flex flex-col">
                <Input
                    lable="Password"
                    placeholder="Enter your new password"
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                        validate: {
                            matchPattern: (value) =>
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                                    value
                                ) ||
                                "Password must have 8 characters, uppercase, lowercase, number, and special character",
                        },
                    })}
                />
                {errors.password && (
                    <p className="text-red-600 mt-2 text-center">{errors.password.message}</p>
                )}
            </div>
            <Button type="submit" className="w-full mt-4">
                      Update Password
                     </Button>

        </form>
        </div>
    )
}