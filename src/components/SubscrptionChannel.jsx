import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { GoBell } from "react-icons/go";
import { IoIosArrowDown } from 'react-icons/io'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { generateNewAccessToken } from '../services/user.service';
import { getSubsribedChannel } from '../services/subscribed.service';
import { logout } from '../store/auth.slice';
import { Link } from 'react-router-dom';
import { DashboardSkeletonLoader } from './DashboardComponenet/Dashboard';
import Sidebar1 from './sidebar/Sidebar1';

const SubscrptionChannel = () => {
    const [loading, setLoading] = useState(true);
    const [subscribedUserData, setSubscribedUserData] = useState([]);
    const authData = useSelector((state) => state.auth.userData);
    const isSidebarStatus = useSelector((state) => state.ui.isSidebarOpen);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            let res = await getSubsribedChannel(authData?._id);
            if (res?.response?.data?.data === "Unauthorized request, Token created") {
                const refresh = await generateNewAccessToken();

                if (refresh?.response?.data?.data === "Refresh Token can not provide please login") {
                    alert("Session expired. Please login again.");
                    dispatch(logout());
                    navigate("/login");
                    return;
                }

                if (refresh?.data?.message === "Access Token is created SuccessFully") {
                    res = await getSubsribedChannel(authData?._id);
                }
            }

            if (res.data.statusCode === 200) {
                console.log(res.data);

                setLoading(false);
                setSubscribedUserData(res?.data?.data);
            }
        }
        fetchData();
    }, []);
    return (
        <div className=' h-screen overflow-hidden'>
        <div className=" h-full hover:overflow-y-auto overflow-hidden flex w-full mt-7">
            {
                !isSidebarStatus && (<Sidebar1/>)
            }
            
            <div className=' w-[70%] mx-auto flex flex-col space-y-5'>
                <div>
                    <h1 className='text-4xl font-bold'>All subscriptions</h1>
                </div>
                <div
                    className="flex gap-x-2 font-bold items-center"
                >
                    <h1 className=''>Most relevent</h1> <IoIosArrowDown /></div>
                <div className=' mt-9 space-y-4'>
                    {
                        loading ? Array.from({length: 6}).map((_, i) => (
                            <DashboardSkeletonLoader key = {i}/>
                        )):
                        subscribedUserData.map((user) => (
                            <div className=' flex gap-5  items-center'>
                                <Link
                                to = {`/${user.username}`}
                                >
                                <div
                                    className="
                        rounded-full overflow-hidden  shrink-0
                        w-[100px] h-[100px]
                        sm:w-[115px] sm:h-[115px]
                        md:w-[155px] md:h-[155px]
                        bg-gray-200
                        cursor-pointer
                    "
                                    key={user._id}
                                >
                                    <img
                                        src={user.avatar}
                                        alt="avatar"
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                                </Link>
                                <Link
                                to ={`/${user.username}`}
                                className='w-[75%]'

                                >
                                <div
                                    className='w-full] flex flex-col mb- cursor-pointer'
                                >
                                    <div class="relative inline-block group ">
                                        <span class="text-lg cursor-pointer">
                                            {user.username}
                                        </span>

                                        <div
                                            class="absolute bottom-full left-[8%] -translate-x-1/2 mb-2
                            bg-gray-600 text-white text-sm px-3 py-1 rounded
                            opacity-0 invisible
                            group-hover:opacity-100 group-hover:visible
                            transition-all duration-300"
                                        >
                                            {user.username}
                                        </div>
                                    </div>


                                    <div className='flex items-center gap-2 text-sm text-gray-500 '>
                                        <div>{user.username}</div>
                                        <div className='bg-gray-300 w-1 h-1 rounded-full'></div>
                                        <div className='flex flex-row items-center'>
                                            <div>{user.subscribersCount}</div>
                                            <div>
                                                <h1>subscribers</h1>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                </Link>
                                <div className='flex items-center cursor-pointer bg-gray-300 rounded-full gap-x-2 max-w-fit max-h-fit px-4 py-2'>
                                    <div><GoBell
                                        className="w-7 h-7"
                                    /></div>
                                    <div className='font-bold'>Subscribed</div>
                                    <div> <IoIosArrowDown
                                        className='h-5 w-5'
                                    /></div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
        </div>
    )
}

export default SubscrptionChannel
