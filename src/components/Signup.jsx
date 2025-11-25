
import React from "react";
import { useForm } from "react-hook-form";
import { Input, Button, Logo } from "./index";
import { Link } from "react-router-dom";
import { SignUp as serviceSignup, Login as serviceLogin } from "../services/user.service";
import { useSelector, useDispatch } from "react-redux";
import {login} from "../store/auth.slice"

export default function Signup() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch()

    const SignUp = async (data) => {
        const result = await serviceSignup(data.username, data.email, data.fullName, data.password, data.avatar[0])
            reset();
            await serviceLogin(data.email, data.password)
            dispatch(login(result))
       
    };


    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 shadow-lg">
                <div className="mb-4 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo />
                    </span>
                </div>

                <h2 className="text-center text-2xl font-bold leading-tight">
                    Sign in to your account
                </h2>

                <p className="mt-2 text-center text-base text-black/60">
                    Have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Login
                    </Link>
                </p>

                {/* Display form errors */}



                <form onSubmit={handleSubmit(SignUp)} className="mt-6 space-y-4">
                    <Input
                        lable="Username"
                        placeholder="Enter username"
                        type="text"
                        {...register("username", {
                            required: "Username should be required"
                        })}

                    />
                    <Input
                        lable="FullName"
                        placeholder="Enter fullName"
                        type="text"
                        {...register("fullName", {
                            required: "FullName should be required"
                        })}

                    />
                    <Input
                        lable="Avatar"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        {...register("avatar", {
                            required: "Avatar image is required",
                            validate: {
                                // ✅ Check file type
                                validFormat: (value) => {
                                    const file = value?.[0];
                                    if (!file) return "Please upload an image";
                                    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
                                    return allowedTypes.includes(file.type)
                                        ? true
                                        : "Only .png, .jpg, and .jpeg files are allowed";
                                },

                            },
                        })}
                    />

                    {errors.avatar && (
                        <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>
                    )}

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

                    <Input
                        lable="Password"
                        placeholder="Enter your password"
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

                    <Button type="submit" className="w-full mt-4">
                        Sign Up
                    </Button>
                </form>
            </div>
        </div>
    );
}
