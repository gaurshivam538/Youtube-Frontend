import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet, Navigate, useLocation  } from 'react-router-dom';
const ProtectedRoute = () => {
const userInfo = useSelector((state) => state.auth.userData);
const location = useLocation();

if (!userInfo) {
   return (
    <Navigate
    to = "/login"
    state={{from : location.pathname}}
    replace
    />

   )
}

  return <Outlet/>
}

export default ProtectedRoute;

// Navigation ke Aproach kyu sahi hai??

// ✔ No side-effects in render
// ✔ Clean & declarative
// ✔ Infinite loop ka risk nahi
// ✔ Login ke baad redirect support
