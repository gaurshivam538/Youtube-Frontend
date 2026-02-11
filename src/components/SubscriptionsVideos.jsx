import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { timeAgo, timingFormat } from './VideoCard/homeLongVideoCard';
import { getVideoBySubscribedChannel } from '../services/video.service';
import { Link } from 'react-router-dom';
import Sidebar1 from './sidebar/Sidebar1';
const SubscriptionsVideos = () => {
    const [videoInfo, setVideoInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const authData = useSelector((state) => state.auth.userData);
    const isSidebarStatus = useSelector((state) => state.ui.isSidebarOpen);
    

    useEffect(() => {
        const fetchData = async() => {
            setLoading(true);
            let res = await getVideoBySubscribedChannel(authData?._id);
            setVideoInfo(res?.data?.data);
            if( res?.data?.statusCode === 200){
                console.log(res?.data?.data);
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    return (
        <div className=" flex h-screen w-full overflow-hidden">
            {
                !isSidebarStatus && (<Sidebar1/>)
            }
            {/* <div>All Subscription</div> */}
            <div className="relative  flex flex-col before:mt-5 flex-1 h-full overflow-y-auto bg-white text-black">

                <div className ={`relative flex justify-between mt-6  `}>
                    <div className=' relative left-5'><h1 className = " font-bold text-xl">Latest</h1></div>
                    <Link
                    to ="/feed/channels"
                    >
                    <div className='relative right-5  cursor-pointer'><h2 className='bg-gray-200 rounded-full py-2 px-4'>All subscription</h2></div>
                    </Link>
                </div>
                <div className="p-4 mt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <SubscriberVideoSkeleton key={i} />
                            ))
                            : (
                                Array.isArray(videoInfo) && videoInfo.length > 0 ?
                                    videoInfo.map((video) => (
                                        <div>
                                            <Link to={`/watch/?v=${video._id}`}>
                                                <div className="w-auto h-full cursor-pointer z-20 pt-2 text-black">
                                                    {/* Thumbnail Box */}
                                                    <div className="relative rounded-xl overflow-hidden aspect-video">
                                                        <video
                                                            // ref={videoRef}
                                                            muted
                                                            preload="metadata"
                                                            playsInline
                                                            poster={video.thumbnail}
                                                            className="w-full h-full object-cover"
                                                        />

                                                        {/* Duration Tag */}
                                                        <span className="absolute bottom-2 right-2  bg-slate-200 text-xs px-1 py-0.5 rounded-md">
                                                            {timingFormat(video.duration)}
                                                        </span>
                                                    </div>

                                                    {/* Video Details */}
                                                    <div className="flex mt-3 gap-3">
                                                        <img
                                                            src={video.user.avatar}
                                                            alt="channel"
                                                            className="w-9 h-9 rounded-full"
                                                        />

                                                        <div>
                                                            <h3 className="font-semibold text-sm">{video.title}</h3>
                                                            <p className="text-gray-400 text-xs mt-1">
                                                                {video.owner.username}
                                                            </p>
                                                            <p className="text-gray-400 text-xs">
                                                                {video.views} views • {timeAgo(video.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                        </div>

                                    ))
                                    : (<p
                                        className='flex justify-center  bg-gray-400 shadow-md rounded-xl'
                                    >
                                        There is no video.....
                                    </p>)
                            )}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SubscriptionsVideos;

const SubscriberVideoSkeleton = () => {
    return(

        <div className="animate-pulse space-y-3">
      <div className="h-56 bg-gray-300 rounded-lg"></div>
      <div className="w-full flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="flex flex-col gap-y-2 w-full">
          <div className="h-6 bg-gray-300 rounded w-4/5"></div>
          <div className="h-6 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>
    );
}
