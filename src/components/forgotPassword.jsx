import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { forgotPassword, verifyOtp } from "../services/user.service";
import { useNavigate } from "react-router-dom";
import { timingFormat } from "./VideoCard/homeLongVideoCard";
import { useDispatch } from "react-redux";
import { setOtp as storeSetOtp, resetOtp, setVerifyUser } from "../store/emailsave.slice";

const ForgotPassword = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const email = useSelector((state) => state.email.emaildata);
  const otpStatus = useSelector((state) => state.email.otpStatus);
  const navigate = useNavigate();
  const [timerValue, setTimerValue] = useState(300);
  const [showResendOtpBtn, setShowResendOtpBtn] = useState(false);
  const intervalRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (otpStatus === true && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimerValue((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setShowResendOtpBtn(true);
            dispatch(resetOtp());
            return 0;
          }
          return prev-1;
        });

      }, 1000);
    }

    if (otpStatus === false) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [otpStatus]);


  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input if a digit is entered
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index] !== "") {
        // agar current input mein value hai → usko delete karo
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // agar current empty hai → previous input clear karo aur focus karo
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };


  const handleSubmit = async () => {
    const otpValue = otp.join("");
    try {
      const res = await verifyOtp(email, otpValue);
      if (res.data.statusCode === 200) {
        alert("OTP Verified Successfully!");
        dispatch(setVerifyUser());
        dispatch(resetOtp());
        navigate("/update-password");
      }
    } catch (error) {
      alert("Invalid OTP. Please try again.");
      console.log(error);
    }
  };
  const handleResendOtp = async () => {

    try {
      const res = await forgotPassword(email);
      if (res?.data?.statusCode === 200) {
        setShowResendOtpBtn(false);
        setTimerValue(20);
        dispatch(storeSetOtp());
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className=" max-w-fit rounded-lg border border-blue-100 shadow-md px-4 py-1">
        {timingFormat(timerValue)}
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-center mb-6">Enter OTP</h2>
        <div className="flex space-x-4 justify-center mb-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              autoFocus={index === 0}
            />
          ))}
        </div>
        {
          showResendOtpBtn && (
            <button className="hover:text-blue-600 hover:underline font-semibold max-w-fit "
              onClick={handleResendOtp}
            >Resend Otp</button>)
        }
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-700 transition duration-300"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
