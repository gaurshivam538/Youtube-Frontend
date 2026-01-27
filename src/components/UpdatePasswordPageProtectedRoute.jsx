
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
const UpdatePasswordPageProtectedRoute = () => {
    
   const verifyUserStatus = useSelector((state) => state.email.verifyUser);
   console.log(verifyUserStatus);
    const location = useLocation();

    if (!verifyUserStatus) {
        return <Navigate
        to = "/login"
        state = {{from: location.pathname}}//Means-> After login redirect the same page thn the user  is go.
        replace
        />
    }
    return <Outlet/>
 
}

export default UpdatePasswordPageProtectedRoute;
