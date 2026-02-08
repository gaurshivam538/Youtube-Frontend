

import { IoMdHome } from "react-icons/io";
import { MdSubscriptions } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import { MdOutlineHome } from "react-icons/md";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdPersonOutline } from "react-icons/md";
import { TbBolt } from "react-icons/tb";
import { FaBolt } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { CgPlayList } from "react-icons/cg";
import { MdOutlineWatchLater } from "react-icons/md";
import { MdWatchLater } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { GoVideo } from "react-icons/go";
import { FaGraduationCap } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useEffect, useState } from "react";
import { getSubsribedChannel } from "../../services/subscribed.service";
import { useSelector, useDispatch } from "react-redux";
import { generateNewAccessToken } from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getVideoBySubscribedChannel } from "../../services/video.service";


const Sidebar2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userSubscribedData, setuserSubscribedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const authData = useSelector((state) => state.auth.userData)

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
        setLoading(false);
        setuserSubscribedData(res?.data?.data);
      }
    }
    fetchData();
  }, []);

  
  return (
    <div className=" bg-white w-56 flex-1 overflow-hidden h-full hover:overflow-y-auto">
      <div className="flex flex-col gap-y-2 pt-2 pb-2 mt-4 pl-4 ">

        {/* Home */}
        <Link
        to = "/"
        >
        <div className="flex items-center gap-x-3 rounded-2xl pl-5  py-2 hover:bg-gray-300 w-full cursor-pointer">
          <MdOutlineHome className="h-7 w-7" />
          <p className="text-base text-gray-900">Home</p>
        </div></Link>

        {/* Shorts */}
        <div className="flex items-center gap-x-3 w-full  rounded-2xl pl-5  py-2 hover:bg-gray-300 cursor-pointer">
          <TbBolt className="h-7 w-7" />
          <p className="text-base text-gray-900">Shorts</p>
        </div>

        {/* Subscriptions */}
        <div className="h-[1px] bg-gray-200 w-full"></div>

        <div className="flex flex-col gap-y-2 w-full">
          <Link
          to = "/feed/subscriptions"
          >
          <div className="flex items-center gap-x-3 w-full  rounded-2xl pl-5  py-2 hover:bg-gray-300 cursor-pointer"
          >
            <p className="text-base text-gray-900">Subscriptions</p>
            <FaAngleRight className="h-4 w-4" />
          </div>
          </Link>

          {
            loading ? Array.from({length:6}).map((_, i) => (
              <SubscribedDetailsSkeleton key = {i}/>
            )) :
            userSubscribedData.map((user) => (
              <Link
              to = {`/${user.username}`}
              >
                 <div
                 key = {user._id}
            className="flex items-center gap-x-3 w-full rounded-2xl pl-3 py-1 pr-2 hover:bg-gray-300 cursor-pointer"
          >
            <div className=" rounded-full w-8 h-8 overflow-hidden  shrink-0">
              <img
              src={user?.avatar}
              className="object-cover w-full h-full object-center"
              />
            </div>

            <div className="flex-1 max-w-28">
              <div className="truncate text-sm font-medium">
               {user.username}
              </div>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-500"></div>
          </div>
          </Link>
            ))
          }
       

          <div className="flex items-center gap-x-3 hover:bg-gray-300 rounded-2xl pl-5  py-2 cursor-pointer">
            {/* <MdOutlineKeyboardArrowUp /> */}
            <MdOutlineKeyboardArrowDown />
            <p className="text-base text-gray-900">Show more</p>
          </div>
        </div>
        {/* Section */}
        <div className="h-[1px] bg-gray-200 w-full"></div>

        <div className="flex flex-col gap-y-2 w-full">

          <div className="flex items-center gap-x-3  rounded-2xl pl-5  py-2 hover:bg-gray-300 cursor-pointer">
            <p className="text-base text-gray-900">You</p>
            <FaAngleRight className="h-4 w-4" />

          </div>

          <div className="flex items-center gap-x-3  rounded-2xl pl-5  py-2 hover:bg-gray-300 cursor-pointer">
            <FaHistory className="h-6 w-6" />
            <p className="text-base text-gray-900">History</p>
          </div>

          <div className="flex items-center gap-x-3  rounded-2xl pl-5  py-2 hover:bg-gray-300 cursor-pointer">
            <CgPlayList className="h-6 w-6" />
            <p className="text-base text-gray-900">Playlist</p>
          </div>

          <div className="flex items-center gap-x-3 hover:bg-gray-300  rounded-2xl pl-5  py-2 cursor-pointer">
            <MdOutlineWatchLater className="h-6 w-6" />
            <p className="text-base text-gray-900">Watch later</p>
          </div>

          <div className="flex items-center gap-x-3 hover:bg-gray-300 rounded-2xl pl-5  py-2 cursor-pointer">
            <AiOutlineLike className="h-6 w-6" />
            <p className="text-base text-gray-900">Liked</p>
          </div>

          <div className="flex items-center gap-x-3 rounded-2xl pl-5  py-2 hover:bg-gray-300 cursor-pointer">
            <GoVideo className="h-6 w-6" />
            <p className="text-base text-gray-900">Your videos</p>
          </div>

          <div className="flex items-center gap-x-3 hover:bg-gray-300 rounded-2xl pl-5  py-2 cursor-pointer">
            <FaGraduationCap className="h-6 w-6" />
            <p className="text-base text-gray-900">Courses</p>
          </div>

          <div className="flex items-center gap-x-3 hover:bg-gray-300 rounded-2xl pl-5  py-2 cursor-pointer">
            {/* <MdOutlineKeyboardArrowUp /> */}
            <MdOutlineKeyboardArrowDown />
            <p className="text-base text-gray-900">Show more</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 w-full">

          <div className="flex items-center gap-x-3  rounded-2xl pl-5  py-2 hover:bg-gray-300 cursor-pointer">
            <p className="text-base text-gray-900">You</p>
            <FaAngleRight className="h-4 w-4" />

          </div>

          <div className="flex items-center gap-x-3  rounded-2xl pl-5  py-2 hover:bg-gray-300 cursor-pointer">
            <FaHistory className="h-6 w-6" />
            <p className="text-base text-gray-900">History</p>
          </div>

          <div className="flex items-center gap-x-3  rounded-2xl pl-5  py-2 hover:bg-gray-300 cursor-pointer">
            <CgPlayList className="h-6 w-6" />
            <p className="text-base text-gray-900">Playlist</p>
          </div>

          <div className="flex items-center gap-x-3 hover:bg-gray-300  rounded-2xl pl-5  py-2 cursor-pointer">
            <MdOutlineWatchLater className="h-6 w-6" />
            <p className="text-base text-gray-900">Watch later</p>
          </div>

          <div className="flex items-center gap-x-3 hover:bg-gray-300 rounded-2xl pl-5  py-2 cursor-pointer">
            <AiOutlineLike className="h-6 w-6" />
            <p className="text-base text-gray-900">Liked</p>
          </div>

          <div className="flex items-center gap-x-3 rounded-2xl pl-5  py-2 hover:bg-gray-300 cursor-pointer">
            <GoVideo className="h-6 w-6" />
            <p className="text-base text-gray-900">Your videos</p>
          </div>

          <div className="flex items-center gap-x-3 hover:bg-gray-300 rounded-2xl pl-5  py-2 cursor-pointer">
            <FaGraduationCap className="h-6 w-6" />
            <p className="text-base text-gray-900">Courses</p>
          </div>

          <div className="flex items-center gap-x-3 hover:bg-gray-300 rounded-2xl pl-5  py-2 cursor-pointer">
            {/* <MdOutlineKeyboardArrowUp /> */}
            <MdOutlineKeyboardArrowDown />
            <p className="text-base text-gray-900">Show more</p>
          </div>
        </div>
        <div className="h-[1px] bg-gray-200 w-full"></div>

      </div>
    </div>
  );
};

export default Sidebar2;

const SubscribedDetailsSkeleton = () => {
  return (
     <div
            className="flex items-center gap-x-2 w-full rounded-2xl pl-3 py-1 pr-2 hover:bg-gray-300 cursor-pointer"
          >
            <div className=" bg-gray-300 animate-pulse rounded-full w-8 h-8 overflow-hidden  shrink-0">
            </div>

            <div className=" bg-gray-300 animate-pulse rounded-lg w-32 h-6">
              
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-500"></div>
          </div>
  )
}


