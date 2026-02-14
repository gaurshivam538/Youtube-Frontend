import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useMatch, useParams, useNavigate } from 'react-router-dom';
import { generateNewAccessToken, userDashboard } from '../../services/user.service';
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/auth.slice';
import { subscribedStatus, toggleSubscriber } from '../../services/subscribed.service';
import { setSubscribedCount } from '../../store/subscribedaction.slice';
import Sidebar1 from '../sidebar/Sidebar1';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [subscribedReaction, setSubscribedReaction] = useState(false);
  const [diffProfSubCount, setDiffProfSubCount] = useState(0);

  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUserData = useSelector((state) => state.auth.userData);
  const SubscriberCount = useSelector((state) => state.subscribe.subscribedCount);
  const isSidebarStatus = useSelector((state) => state.ui.isSidebarOpen);

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
          dispatch(setSubscribedCount(res?.data?.data?.subscribersCount));
          setDiffProfSubCount(res?.data?.data?.subscribersCount);
        }
        console.log(res?.data?.data?._id);
        console.log(res?.data?.data?._id.toString());
        console.log()

        if (res?.data?.data?._id.toString() === authUserData?._id.toString()) {
          console.log("Hai");
          setLoggedInUser(true);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, dispatch, navigate]);

  useEffect(() => {
    const fetchSubscribeStatus = async () => {
      let res = await subscribedStatus(userInfo?._id);
      if (res?.response?.data?.data === "Unauthorized request, Token created") {
        const res2 = await generateNewAccessToken();
        if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
          alert("Your refresh Token expiry, please Login and useSpecific services");
          dispatch(logout());
          navigate("/login")
          return;
        }
        if (res2?.data?.message === "Access Token is created SuccessFully") {
          const res3 = await subscribedStatus(userInfo?._id); (userInfo._id);
          res = res3;
          return;
        }
      }
      if (res?.data?.data?.subscribed === true) {
        setSubscribedReaction(true);
        return;
      }
      if (res?.data?.data?.subscribed === false) {
        setSubscribedReaction(false);
        return;
      }
    }
    fetchSubscribeStatus();
  }, [userInfo]);

  const handletoggleSubscribed = async () => {
    if (subscribedReaction === true) {
      setSubscribedReaction(false);
      setDiffProfSubCount((prev) => {
        if (prev === 0) {
          return;
        }
        return prev - 1;
      })
    }

    if (subscribedReaction === false) {
      setSubscribedReaction(true);
      setDiffProfSubCount((prev) => prev + 1);
    }

    let res = await toggleSubscriber(userInfo?._id);
    if (res?.response?.data?.data === "Unauthorized request, Token created") {
      setSubscribedReaction(false);
      const res2 = await generateNewAccessToken();
      if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
        setSubscribedReaction(false);
        alert("Your refresh Token expiry, please Login and useSpecific services");
        dispatch(logout());
        navigate("/login")
        return;
      }
      if (res2?.data?.message === "Access Token is created SuccessFully") {
        const res3 = await toggleSubscriber(channelId);
        res = res3;
        return;
      }
    }

    if (res?.data?.message === "Unsubscribed Successfully") {
      setSubscribedReaction(false);

      return;
    }

    if (res?.data?.message === "Subscribed Successfully") {
      setSubscribedReaction(true);
    }
  }

  const homeMatch = useMatch(`/${username}`);
  const featuresMatch = useMatch(`/${username}/features`);
  const isHomeActive = homeMatch || featuresMatch;

  return (
    <div className='flex flex-row h-full w-full'>
      {
        !isSidebarStatus && (<Sidebar1 />)
      }


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
    rounded-full overflow-hidden  shrink-0
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
                  {
                    loggedInUser ? (<span>{SubscriberCount} subscribers</span>) : (<span>{diffProfSubCount} subscribers</span>)
                  }

                  <span>•</span>
                  <span>{userInfo?.videoCount} videos</span>
                </div>

                <div className="text-gray-400 text-sm">
                  More about this channel <span className="text-gray-400 cursor-pointer">...more</span>
                </div>
                {
                  loggedInUser ? (
                  <div className="hidden md:flex gap-2 mt-2">
                    <button className="rounded-full px-4 py-2 bg-gray-200 ">
                      Customize channel
                    </button>
                    <button className="rounded-full px-4 py-2 bg-gray-200">
                      Manage videos
                    </button>
                  </div>
                ) : (
                <div className="hidden md:flex gap-2 mt-2">
                    <button className={`rounded-full px-4 py-2  ${subscribedReaction ? "bg-red-400" : "bg-gray-200"}`
                    }
                      onClick={handletoggleSubscribed}
                    >
                      {
                        subscribedReaction ? (<h1>Subscribed</h1>) : (<h1>Subscribe</h1>)
                      }
                    </button>
                    <button className="rounded-full px-4 py-2 bg-gray-200">
                      Join
                    </button>
                  </div>
                  )
                }

              </div>
            </div>
          )}

          {/* MOBILE BUTTONS */}
          {
            loggedInUser ? (<div class="mt-4 flex flex-row w-full md:hidden gap-9">
              <button class="min-w-fit py-2 px-9 bg-gray-200 rounded-full">Customize</button>
              <button class="min-w-fit py-2 px-9 bg-gray-200 rounded-full">Manage</button>
            </div>) : (
              <div className="mt-4 flex md:hidden gap-2">
              <button className={`w-1/2 py-2  rounded-full ${subscribedReaction ? "bg-red-500" : "bg-gray-200"}`}>
                {
                  subscribedReaction ? (<h1>Subscribed</h1>) : (<h1>Subscribe</h1>)
                }
              </button>
              <button className=" opacity-70 cursor-not-allowed w-1/2 py-2 bg-gray-200 rounded-full">
                Join
              </button>
            </div>)
          }

        </div>

        {/* NAV */}
        <div className="flex w-[85%] mx-auto gap-8 mt-8 text-lg font-bold text-gray-500 items-center">
          <NavLink
            to={`/${username}/features`}
            className={`relative after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:bg-black after:transition-all ${isHomeActive ? "after:w-full" : "after:w-0 hover:after:w-full"
              }`}
          >
            Home
          </NavLink>

          {["videos", "shorts", "posts"].map(tab => (
            <NavLink
              key={tab}
              to={`/${username}/${tab}`}
              className={({ isActive }) =>
                `relative after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:bg-black after:transition-all ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
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

export {
  DashboardSkeletonLoader
}
