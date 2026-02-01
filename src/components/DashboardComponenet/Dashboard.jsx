import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useMatch, useParams, useNavigate } from 'react-router-dom';
import { generateNewAccessToken, userDashboard } from '../../services/user.service';
import { FaSearch } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { logout } from '../../store/auth.slice';

const Dashboard = () => {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let res = await userDashboard(username);

        if (res?.response?.data?.data === "Unauthorized request, Token created") {
          const refresh = await generateNewAccessToken();

          if (refresh?.response?.data?.data === "Refresh Token can not provide please login") {
            alert("Session expired. Please login again.");
            dispatch(logout());
            navigate("/login");
            return;
          }

          if (refresh?.data?.message === "Access Token is created SuccessFully") {
            res = await userDashboard(username);
          }
        }

        if (res?.status === 200) {
          setUserInfo(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, dispatch, navigate]);

  const homeMatch = useMatch(`/${username}`);
  const featuresMatch = useMatch(`/${username}/features`);
  const isHomeActive = homeMatch || featuresMatch;

  return (
    <div className="w-full h-full">
      {/* USER INFO */}
      <div className="flex flex-col w-[85%] mx-auto mt-10">
        {loading ? (
          <DashboardSkeletonLoader />
        ) : (
          <div className="flex items-center gap-4">
            {/* ✅ FIXED AVATAR */}
            <div
  className="
    rounded-full overflow-hidden bg-gray-300 shrink-0
    w-[105px] h-[105px]
    sm:w-[120px] sm:h-[120px]
    md:w-[160px] md:h-[160px]
  "
>
  <img
    src={userInfo?.avatar}
    alt="avatar"
    className="w-full h-full object-cover object-center"
  />
</div>


            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-medium">{userInfo?.fullName}</h1>

              <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
                <span>{userInfo?.username}</span>
                <span>•</span>
                <span>{userInfo?.subscribersCount} subscribers</span>
                <span>•</span>
                <span>{userInfo?.videoCount} videos</span>
              </div>

              <div className="text-gray-400 text-sm">
                More about this channel <span className="text-white cursor-pointer">...more</span>
              </div>

              <div className="hidden md:flex gap-2 mt-2">
                <button className="rounded-full px-4 py-2 bg-gray-200 ">
                  Customize channel
                </button>
                <button className="rounded-full px-4 py-2 bg-gray-200">
                  Manage videos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE BUTTONS */}
        <div className="mt-4 flex md:hidden gap-2">
          <button className="w-1/2 py-2 bg-gray-200 rounded-full">
            Customize channel
          </button>
          <button className="w-1/2 py-2 bg-gray-200 rounded-full">
            Manage channel
          </button>
        </div>
      </div>

      {/* NAV */}
      <div className="flex w-[85%] mx-auto gap-8 mt-8 text-lg font-bold text-gray-500 items-center">
        <NavLink
          to={`/${username}/features`}
          className={`relative after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:bg-black after:transition-all ${
            isHomeActive ? "after:w-full" : "after:w-0 hover:after:w-full"
          }`}
        >
          Home
        </NavLink>

        {["videos", "shorts", "posts"].map(tab => (
          <NavLink
            key={tab}
            to={`/${username}/${tab}`}
            className={({ isActive }) =>
              `relative after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:bg-black after:transition-all ${
                isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
              }`
            }
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </NavLink>
        ))}

        <FaSearch />
      </div>

      <div className="h-[1px] bg-gray-300 w-[95%] mx-auto mt-4" />

      <div className="w-[85%] mx-auto mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;

const DashboardSkeletonLoader = () => (
  <div className="flex items-center gap-4 animate-pulse">
    <div className="w-[160px] aspect-square rounded-full bg-gray-200" />
    <div className="flex flex-col gap-2 w-full">
      <div className="w-1/2 h-5 bg-gray-200 rounded" />
      <div className="w-2/3 h-5 bg-gray-200 rounded" />
      <div className="w-3/4 h-5 bg-gray-200 rounded" />
    </div>
  </div>
);
