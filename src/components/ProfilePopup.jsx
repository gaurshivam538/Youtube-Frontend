
import React from 'react'
import { useRef } from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { generateNewAccessToken, Userprofile as serviceUserprofile } from '../services/user.service';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {logout} from "../components/../store/auth.slice"
import {Logout} from "./index"

const ProfilePopup = () => {
    const [open, setopen] = useState(false);
    const authStatus = useSelector((state) => state.auth.status)
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const menuRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const res = await serviceUserprofile();
            if (res?.message === "Request failed with status code 401") {
                const res5 = await generateNewAccessToken();
                if (res5?.response?.data?.data === "Refresh Token can not provide please login") {
                    alert("Your refresh Token expiry, please Login and useSpecific services");
                    dispatch(logout());
                    navigate("/login");
                    return;
                }
                if (res5?.data?.message === "Access Token is created SuccessFully") {
                    const res6 = await serviceUserprofile();
                    console.log(res6)
                    setUserInfo(res6?.data?.data);
                    return;
                }
            return;
            }
            
            if (res?.response?.data?.data === "Unauthorized request, Token created") {
                const res2 = await generateNewAccessToken();
                if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
                    alert("Your refresh Token expiry, please Login and useSpecific services");
                    dispatch(logout());
                    navigate("/login");
                    return;
                }
                if (res2?.data?.message === "Access Token is created SuccessFully") {
                    const res3 = await serviceUserprofile();
                    console.log(res3)
                    setUserInfo(res3?.data?.data);
                    return;
                }
            }
            if (res?.data?.statusCode === 200){
            setUserInfo(res?.data?.data);
            setLoading(false);
            }

        }
        fetchUserData();
    }, [authStatus]);


    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setopen(false)
            }
        }
        document.addEventListener("mousedown", handler)

        return () => document.removeEventListener("mousedown", handler);

    }, []);
    // const {username} = useParams();


    return (
        <div className='relative' ref={menuRef}>
            {
                loading? (<ProfileSkeleton/>): (  <button
                onClick={() => setopen(!open)}
                className='overflow-hidden rounded-full h-8 w-8 object-cover cursor-pointer'
            >
                <img
                    src={`${userInfo?.userImage}`}
                    className='overflow-hidden'
                />

            </button>)
            }
          
            {
                open && (
                    <div className=' absolute right-0 mt-2 text-lg w-80 p-4  bg-slate-200 text-black dark:text-white shadow-lg z-30 flex flex-col rounded-xl'>
                        <div className='flex gap-x-3 items-center'>
                            <div className=' h-10 w-10 rounded-full overflow-hidden object-cover'>
                                <img
                                    src={`${userInfo?.userImage}`}
                                    className='overflow-hidden'
                                />
                            </div>
                            <div className=''>
                                <h3 className='mt-2'>
                                    {`${userInfo?.userFullname}`}
                                </h3>
                                <h3 className=''>
                                    {`${userInfo?.username}`}
                                </h3>
                            </div>
                        </div>
                        <div className='ml-12 mt-1 cursor-pointer'>
                            <Link to={`/${userInfo?.username}`} className='text-blue-600 
                            '
                                onClick={() => setopen(!open)}
                            >
                                View your channel
                            </Link>
                        </div>
                        <div className='w-[100%] h-[1px] bg-gray-500 mt-4'></div>
                        <div
                        className = "w-full mt-3 flex flex-col gap-x-3"
                        >
                            <div
                            className='ml-[6px]'
                            >
                                <Logout/>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ProfilePopup

export const ProfileSkeleton = () => {
  return (
   <div
   className='animate-pulse h-10 w-10 bg-gray-300 rounded-full'
   ></div>
  );
};
