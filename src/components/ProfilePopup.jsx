
import React from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { generateNewAccessToken, Userprofile as serviceUserprofile } from '../services/user.service';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProfilePopup = () => {
    const [open, setopen] = useState(false);
    const authStatus = useSelector((state) => state.auth.status)
    const [userInfo, setUserInfo] = useState({});
    const menuRef = useRef();

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await serviceUserprofile();
                            //  console.log(res);
                            //  if (res?.response?.data?.data === "Unauthorized request, Token created") {
                            //     console.log("hai")
                            //    const res2 =  await generateNewAccessToken();
            
                            //    if (res2?.response?.data?.statusCode === 201) {
                            //     const res3 = await serviceUserprofile();
                            //     setUserInfo(res3?.data?.data);
                            //    }
                            //  }
            setUserInfo(res?.data?.data);
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
            <button
                onClick={() => setopen(!open)}
                className='overflow-hidden rounded-full h-8 w-8 object-cover cursor-pointer'
                >
                <img
                    src={`${userInfo.userImage}`}
                    className='overflow-hidden'
                />

            </button>
            {
                open && (
                    <div className=' absolute right-0 mt-2 text-lg w-80 p-4  bg-slate-200 text-white shadow-lg z-30 flex flex-col rounded-xl'>
                        <div className='flex gap-x-3 items-center'>
                            <div className=' h-10 w-10 rounded-full overflow-hidden object-cover'>
                                <img
                                    src={`${userInfo.userImage}`}
                                    className='overflow-hidden'
                                />
                            </div>
                            <div className=''>
                                <h3 className='mt-2'>
                                    {`${userInfo.userFullname}`}
                                </h3>
                                <h3 className=''>
                                    {`${userInfo.username}`}
                                </h3>
                            </div>
                        </div>
                        <div className='ml-12 mt-1 cursor-pointer'>
                            <Link to={`/${userInfo.username}`} className='text-blue-600 
                            '
                            onClick={() => setopen(!open)}
                            >
                                View your channel
                            </Link>
                        </div>
                        <div className='w-[100%] h-[1px] bg-gray-500 mt-4'></div>
                    </div>
                )
            }
        </div>
    )
}

export default ProfilePopup
