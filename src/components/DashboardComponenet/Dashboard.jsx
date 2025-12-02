
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { userDashboard } from '../../services/user.service';
import { FaSearch } from "react-icons/fa";
import DashboardForYouPortion from './DashboardForYouPortion';
const Dashboard = () => {
  const { username } = useParams()
  const [userInfo, setuserInfo] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const response = await userDashboard(username);
      if (!response) {
        console.log("No API Response Received");
        return;
      }
      if (response.status == 200) {
        setuserInfo(response.data.data)
      }

    }
    fetchData();

  }, [username]);
  return (
    <div className=' w-[100%] mx-auto h-full'>
      {/* User Info */}
      <div className='flex w-[85%] h-[30%] mx-auto items-center mt-[40px] gap-x-6'>
        <div className='rounded-full w-[188px] h-[188px] overflow-hidden object-cover'>
          <img
            src={`${userInfo.avatar}`}
            className='h-full w-full '
          />
        </div>
        <div className='flex flex-col gap-y-2'>
          <div className='flex '>
            <h1 className='text-4xl font-bold'>{`${userInfo.fullName}`}</h1>
          </div>
          <div className='flex gap-x-2 items-center'>
            <div >
              <h3 className='text-2xl items'>{`${userInfo.username}`}</h3>
            </div>
            <div>.</div>
            <div
              className='flex items-center gap-x-2 text-gray-500'>
              <h3 className='text-gray-600 text-xl  gap-x-1 items-center '>{`${userInfo.subscribersCount}`} </h3>
              <h4 className='text-md'>subscribers</h4>
            </div>
            <div>.</div>
            <div className="flex gap-x-1 text-gray-500">
              <h3>{`${userInfo.videoCount}`}</h3>
              <h4>videos</h4>
            </div>
          </div>
          <div className='flex gap-x-1 text-gray-400'>
            <p>More about this channel</p>
            <p className='text-gray-100'>...more</p>
          </div>
          <div className='flex gap-x-2 w-full '>
            <button className="rounded-full px-3 py-2  bg-[#313537]">Customize channel</button>
            <button className="rounded-full px-3 py-2  bg-[#313537]">Manage video</button>
            <button className="rounded-full px-3 py-2  bg-[#313537]">Visit Community</button>
          </div>
        </div>
      </div>
      {/* content-type */}
      <div className='flex w-[85%] h-[5%] mx-auto items-center gap-x-8 mt-6 text-lg font-bold text-gray-500'>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/">Videos</Link>
        </div>
        <Link to="/">Shorts</Link>
        <div>
          <Link to="/">Posts</Link>
        </div>
        <div>
          <FaSearch />
        </div>
      </div>
      <div className='h-[1px] bg-gray-300 w-[95%] mx-auto mt-4'></div>
      <div className='w-[85%] mx-auto h-full'>

        <div className='flex flex-col gap-y-4 h-1/2'>
          <div className='mt-4 text-xl font-bold'><h1>For You</h1></div>
          <div className='h-[80%]'>
            <DashboardForYouPortion  data={userInfo.vc}>

            </DashboardForYouPortion>
          </div>
        </div>
        <div className='h-[1px] bg-gray-300 w-full mt-4 mx-auto '></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Dashboard;
