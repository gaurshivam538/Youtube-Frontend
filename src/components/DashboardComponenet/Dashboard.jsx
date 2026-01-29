
import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useMatch, useParams } from 'react-router-dom';
import { generateNewAccessToken, userDashboard } from '../../services/user.service';
import { FaSearch } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth.slice';

const Dashboard = () => {
  const { username } = useParams()
  const [userInfo, setuserInfo] = useState({})
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let res = await userDashboard(username);
      if (res?.response?.data?.data === "Unauthorized request, Token created") {
        const res2 = await generateNewAccessToken();
        if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
          alert("Your refresh Token expiry, please Login and useSpecific services");
          dispatch(logout());
          navigate("/login");
          return;
        }
        if (res2?.data?.message === "Access Token is created SuccessFully") {
          const res3 = await userDashboard(username);
          res = res3;
          
          return;
        }
      }
      if (!res) {
        console.log("No API Response Received");
        return;
      }
      if (res?.status == 200) {
        setuserInfo(res?.data?.data)
        // console.log(response.data.data)
        return;
      }

    }
    fetchData();

  }, [username]);

  const homeMatch = useMatch(`/${username}`);//match the url value 
  const featuresMatch = useMatch(`/${username}/features`);

  const isHomeActive = homeMatch || featuresMatch;
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
          <div className='flex gap-x-2 w-full font-bold '>
            <button className="rounded-full px-3 py-2  bg-[#313537]">Customize channel</button>
            <button className="rounded-full px-3 py-2  bg-[#313537]">Manage video</button>
            <button className="rounded-full px-3 py-2  bg-[#313537]">Visit Community</button>
          </div>
        </div>
      </div>
      {/* content-type */}
      <div className='flex w-[85%] h-[5%] mx-auto items-center gap-x-8 mt-6 text-lg font-bold text-gray-500'>
        <div className=''>
          <NavLink
            to={`/${username}/features`}
            className={
              `relative cursor-pointer after:absolute after:left-0 after:-bottom-4 
     after:h-[3px] after:bg-black after:transition-all
     ${isHomeActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
            }
          >
            Home
          </NavLink>

        </div>
        <div>
          <NavLink
            to={`/${username}/videos`}
            className={({ isActive }) =>
              `relative cursor-pointer after:absolute after:left-0 after:-bottom-4 
     after:h-[3px] after:bg-black after:transition-all
     ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
            }
          >
            Videos
          </NavLink>
        </div>
        <NavLink
          to={`/${username}/shorts`}
          className={({ isActive }) =>
            `relative cursor-pointer after:absolute after:left-0 after:-bottom-4 
     after:h-[3px] after:bg-black after:transition-all
     ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
          }
        >
          Shorts
        </NavLink>
        <div>
          <NavLink
            to="/posts"
            className={({ isActive }) =>
              `relative cursor-pointer after:absolute after:left-0 after:-bottom-4 
     after:h-[3px] after:bg-black after:transition-all
     ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
            }
          >
            Posts
          </NavLink>
        </div>
        <div>
          <FaSearch />
        </div>
      </div>
      <div className='h-[1px] bg-gray-300 w-[95%] mx-auto mt-4'></div>
      <div className='w-[85%] mx-auto h-full'>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
