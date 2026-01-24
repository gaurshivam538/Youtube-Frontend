import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, Logo } from "./index";
import { Link } from "react-router-dom";
import { Login as serviceLogin } from "../services/user.service"
import { jwtDecode } from "jwt-decode";//access Token sa value niklna ka liya
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/auth.slice";
import { useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogin as serviceGoogleLogin } from "../services/user.service";
import { setEmail, setOtp } from "../store/emailsave.slice";


export default function Login() {
  const {
    register,
    handleSubmit,
    reset, getValues,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const login = (data) => {
    const sessionRedirect =
      sessionStorage.getItem("postLoginRedirect");

    const stateRedirect = location.state?.from;
    const redirectTo =
      sessionRedirect || "/";

    serviceLogin(data.email, data.password).then((result) => {
      reset();

      if (result.data.message === "Successs") {

        dispatch(authLogin(result.data.data.user));

        if (sessionRedirect) {
          navigate(redirectTo)
          return;
        }

        if (stateRedirect) {
          navigate(stateRedirect, { replace: true });
          return;
        }
        navigate("/");


      }
      // const token = result.data.data.accessToken
      // const decoded = jwtDecode(token);
      // console.log(decoded);
      // console.log(decoded.email);
      // console.log(decoded.username);
      // console.log(decoded.fullName);
      // console.log(decoded._id);
    })


  };

  const handleSuccess = async (authCode) => {

    if (!authCode) {
      console.log("AuthCode can not provide")
    }
    const sessionRedirect =
      sessionStorage.getItem("postLoginRedirect");

    const stateRedirect = location.state?.from;
    const redirectTo =
      sessionRedirect || "/";

    if (authCode?.code) {
      const res = await serviceGoogleLogin(authCode?.code);
      console.log(res.data.statusCode);
      if (res?.data?.statusCode === 200) {
        dispatch(authLogin(res?.data?.data));

        if (sessionRedirect) {
          navigate(redirectTo)
          return;
        }

        if (stateRedirect) {
          navigate(stateRedirect, { replace: true });
          return;
        }
        navigate("/");
      }

    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleSuccess,
    flow: 'auth-code'
  })

  const handleForgetPassword = async () => {
    const emailVal = getValues("email");
    const otpVal = "123456"
    dispatch(setEmail(emailVal));
    dispatch(setOtp(otpVal));
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
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
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* Display form errors */}
        {errors.email && (
          <p className="text-red-600 mt-4 text-center">{errors.email.message}</p>
        )}
        {errors.password && (
          <p className="text-red-600 mt-2 text-center">{errors.password.message}</p>
        )}

        <form onSubmit={handleSubmit(login)} className="mt-6 space-y-4">
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
          <div
          className="flex flex-col ">
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
            <Link
            to ="/forgot-password"
            >
            <button
              className="hover:underline hover:text-blue-600  ml-72 "
              onClick={handleForgetPassword}
              >
              Forgot password
            </button>
            </Link>
          </div>


          <Button type="submit" className="w-full mt-4">
            Sign In
          </Button>
        </form>
      </div>
      <div className="h-[2px] mx-auto max-w-lg w-full mt-4 bg-slate-500 "></div>
      <button
        className="mt-4  border border-blue-100 rounded-lg shadow-md  max-w-lg w-full t bg-transparent  p-2 " onClick={googleLogin}
      >Continue With Google</button>
    </div>
  );
}
