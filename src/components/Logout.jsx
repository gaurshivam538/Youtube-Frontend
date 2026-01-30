
import React from 'react';
import { useDispatch } from 'react-redux';
import {logout} from "../store/auth.slice"
import { Logout as serviceLogout} from '../services/user.service';
import { AiOutlineLogout } from "react-icons/ai";

function Logout() {

    const dispatch = useDispatch()
    const logoutHandler = async () => {
        try {
            await serviceLogout();
            dispatch(logout());
    
        } catch (error) {
            console.log("Error throw the logout function calling",error)
        }
    }


    return (
        <div>
            <button onClick={() => logoutHandler()} className="hover:text-blue-500 cursor-pointer flex text-black dark:text-white  gap-x-3 items-center">
                <AiOutlineLogout 
                className ="w-8 h-8"
                />
                <h1>Logout</h1>
            </button>
        </div>
    );
}

export default Logout;
