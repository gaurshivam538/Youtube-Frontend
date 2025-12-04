import React, { useEffect, useState } from 'react'
import Dashboard from '../Dashboard'
import { useParams } from 'react-router-dom'
import { userDashboard } from '../../../services/user.service'
import DashboardForYouPortion from '../DashboardForYouPortion'
import DashboardVideoPortion from '../DashboardVideoPortion'
import { SiYoutubeshorts } from 'react-icons/si'
import DashboardShortPortion from '../DashboardShortPortion'
const DashboardHomePage = () => {
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
        console.log(response.data.data)
      }

    }
    fetchData();

  }, [username]);
  return (
    <div>
      <div className='flex flex-col gap-y-4 h-1/2'>
        <div className='mt-4 text-xl font-bold'><h1>For You</h1></div>
        <div className='h-[80%]'>
          <DashboardForYouPortion data={userInfo.vc}>

          </DashboardForYouPortion>
        </div>
      </div>
      <div className='h-[1px] bg-gray-300 w-full mt-8 '></div>
      {/* Video portion */}
      <div className='w-full  h-full flex flex-col gap-y-3  mt-2'>
        <div className='mt-4 text-xl font-bold'><h1>Videos</h1></div>
        <div className='w-full h-full'>
          <DashboardVideoPortion
            data={userInfo.vc}
          >
          </DashboardVideoPortion>
        </div>
      </div>
      <div className='h-[1px] bg-gray-300 w-full mt-8 '></div>

      {/* {Short Portion} */}
      <div className='w-full  h-full flex flex-col gap-y-3  mt-2'>
        <div className='mt-4 text-xl font-bold flex items-center'>
          <SiYoutubeshorts style={{ color: "red", height: "40px", width: "30px" }} />
          <h1 className='ml-[10px] mb-1'>Shorts</h1></div>
        <div className='w-full h-full'>
          <DashboardShortPortion data={userInfo.vc} />
        </div>
      </div>
      <div className='h-[1px] bg-gray-300 w-full mt-8 '></div>

    </div>
  )
}

export default DashboardHomePage
