import React, { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { getNotification, getNotificationCount } from '../services/notification.service';

const Notification = () => {
    const [open, setOpen] = useState(false);
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
        getNotification(authData?._id);
        getNotificationCount(authData?._id);
      }
      fetchNotificationCount();
    },[]);

  return (
    <div className=' relative z-10' ref ={menuRef}>
    <div className='relative flex flex-col cursor-pointer hover:bg-gray-200   rounded-full'
    onClick={()=>setOpen(!open)}
    >
      <div ><IoNotificationsOutline 
      className='w-7 h-7 z-20 font-extrabold'
      /></div>
      <div className='absolute text-xs top-0 right-0 text-white bg-red-600 rounded-full px-1'>1</div>
    </div>
    {
        open && (
           <div className="bg-white z-10 md:w-[540px] text-black absolute md:right-0 w-[450px] -right-7 mt-4 rounded-lg shadow-lg flex flex-col">

  {/* Header */}
  <div className="flex justify-between items-center p-3">
    <div className="text-lg ">Notification</div>
    <IoSettingsOutline className="w-6 h-6 cursor-pointer" />
  </div>

  <div className="w-full h-[1px] bg-gray-300"></div>

  <div className="flex flex-col gap-y-4 p-3">

    <div className="text-sm text-gray-800 cursor-pointer">
      More notification
    </div>

    <div className="flex gap-3 items-start">

      <div className="h-12 w-12 rounded-full bg-gray-200"></div>

      <div className="flex flex-col flex-1">
        <div className="text-sm ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, repporibus magnam. lorem+1 3 32452345335
        </div>
        <div className="text-xs text-gray-500 mt-1">
          7 hours ago
        </div>
      </div>

      <div className="w-20 h-12 rounded bg-gray-200"></div>

      <BsThreeDotsVertical className="h-5 w-5 cursor-pointer" />

    </div>

  </div>
</div>

        )
    }
    </div>
  );
}

export default Notification;
