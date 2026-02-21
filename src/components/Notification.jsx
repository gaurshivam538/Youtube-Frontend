import React, { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { getNotification, getNotificationCount } from '../services/notification.service';
import { timeAgo } from './VideoCard/homeLongVideoCard';
import { ProfileSkeleton } from './ProfilePopup';
import {Link} from "react-router-dom"

const Notification = () => {
    const [open, setOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [notificationloading, setNotificationLoading] = useState(false);
    const [notificationIconLoading, setNotificationIconLoading] = useState(false);
    const menuRef  = useRef();
    const authData = useSelector((state) => state.auth.userData);
   useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)

        return () => document.removeEventListener("mousedown", handler);

    }, []);

    useEffect(() => {
      const fetchNotificationCount = async() => {
        // getNotification(authData?._id);
        setNotificationIconLoading(true);
        const res = await getNotificationCount(authData?._id);
        console.log(res?.data);
        if (res?.data?.statusCode ===200) {
          setNotificationIconLoading(false);
          setNotificationCount(res?.data?.data?.unreadCount);
        }

      }
      fetchNotificationCount();
    },[]);

    useEffect(() => {
     const fetchNotification = async() => {
      setNotificationLoading(true);

       if (!open) {
         return;
        }
        const res = await getNotification(authData?._id);
        if (res?.data?.statusCode === 200) {
          setNotificationLoading(false);
          setNotifications(res?.data?.data?.notifications);
        }
      }
      fetchNotification();
    }, [open, authData?._id]);

  return (
    <div className=' relative z-10' ref ={menuRef}>
      {
        notificationIconLoading? (<ProfileSkeleton/>) :(
           <div className='relative flex flex-col cursor-pointer hover:bg-gray-200   rounded-full'
    onClick={()=>setOpen(!open)}
    >
      <div ><IoNotificationsOutline 
      className='w-7 h-7 z-20 font-extrabold'
      /></div>
      {
        notificationCount > 0 && (
           <div className='absolute text-xs top-0 right-0 text-white bg-red-600 rounded-full px-1'>{notificationCount}</div>
        )
      }
     
    </div>
        )
      }
   
    {
        open && (
          
    <div className="bg-white z-10 md:w-[540px] text-black absolute md:right-0 w-[450px] -right-7 mt-4 rounded-lg shadow-lg flex flex-col">

  {/* Header */}
  <div className="flex justify-between items-center p-3 ">
    <div className="text-lg">Notification</div>
    <IoSettingsOutline className="w-6 h-6 cursor-pointer" />
  </div>

  <div className="w-full h-[1px] bg-gray-300"></div>

  {/* ✅ SCROLLABLE AREA */}
  <div className="flex flex-col gap-y-4 p-3 pl-0 pr-0  max-h-[400px] overflow-hidden hover:overflow-y-auto ">

    {
    notifications.map((notification) => (
       <Link
        to={`/watch/?notification=${notification.entityId}`}
        >
      <div key={notification._id} className="flex gap-3 items-center justify-center cursor-pointer hover:bg-gray-300 p-2 ">
       
        {!notification.isRead && (
          <div className="h-1 w-1 rounded-full bg-gray-400"></div>
        )}

        <div className="h-12 w-12">
          <img
            src={notification?.senderAvatar}
            className="h-full w-full object-cover rounded-full"
          />
        </div>

        <div className="flex flex-col flex-1">
          <div className="text-sm">{notification.title}</div>
          <div className="text-xs text-gray-500 mt-1">
            {timeAgo(notification.createdAt)}
          </div>
        </div>

        <div className="w-20 h-12">
          <img
            src={notification?.thumbnail}
            className="h-full w-full object-cover"
          />
        </div>

        <BsThreeDotsVertical className="h-5 w-5 cursor-pointer" />

      </div>
      </Link>
    ))
    
    }
    {
      notificationloading && Array.from({length:4}).map((_, index)=>(
        <NotificationSkeleton key ={index}/>
      ))
    }

  </div>
</div>

        )
    }
    </div>
  );
}

export default Notification;

const NotificationSkeleton = ()=>{
  return (
    <div className='flex flex-row items-center h-full gap-x-4 w-full'>
      <div className='h-10 w-10 rounded-full animate-pulse bg-gray-200'></div>
      <div className='h-6  animate-pulse bg-gray-200 flex flex-1'></div>
      <div className='h-12 w-20 animate-pulse bg-gray-200'></div>
    </div>
  );
}

