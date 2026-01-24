import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ForgotPassword = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); 
  const email = useSelector((state) => state.email.emaildata);
  const storedOtp = useSelector((state) => state.email.otpdata);
  console.log("Email =>",email, "otp =>", storedOtp)

  useEffect(() => {
    const fetchOtp = async () => {
      try {
       
        const otpFromBackend = "123456"; 
        setOtp(otpFromBackend.split(''));  // Split OTP into an array to autofill
      } catch (error) {
        console.error('Error fetching OTP:', error);
      } 
    };
    fetchOtp();
  }, []);

  
  const handleSubmit = () => {
    const otpValue = otp.join("");  // Join OTP array to form a single string
    if (otpValue === storedOtp) {  // Replace with actual OTP validation
      alert("OTP Verified Successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Enter OTP</h2>
        {/* {loading && <p>Loading OTP...</p>}  Show loading message while fetching OTP */}
        <div className="flex space-x-4 justify-center mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              autoFocus={index === 5}  
            />
          ))}
        </div>
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
