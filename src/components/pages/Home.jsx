import React, { useEffect, useState } from 'react'; 
import { getAllVideos } from '../../services/video.service'; 
import {HomeLongVideoCard} from '../VideoCard/homeLongVideoCard'; 
import HomeShortVideoCard from '../VideoCard/homeShortVideoCard'; 
import { useSelector } from 'react-redux'; 
import Sidebar1 from '../sidebar/Sidebar1'; 
import Sidebar2 from '../sidebar/Sidebar2';  

function HomePage() { 
  const [videoInfo, setVideoInfo] = useState([]); 
  const [shortVideoInfo, setshortVideoInfo] = useState([]); 
  const [longVideoInfo, setlongVideoInfo] = useState([]); 
  const [loading, setLoading] = useState(true); 

  const userData = useSelector((state) => state.auth.userData); 
  const isSidebarStatus = useSelector((state) => state.ui.isSidebarOpen);
  

  useEffect(() => { 
    const fetchVideoInfo = async () => { 
      try { 
        setLoading(true); 
        let response = await getAllVideos(); 
        response = Array.isArray(response) ? response: [];

        setVideoInfo(response); 
        if (videoInfo.length >= 0) {
          setshortVideoInfo(response.filter((v) => v.category === "short")); 
        setlongVideoInfo(response.filter((v) => v.category === "long")); 
        }
        
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      } 
    };

    fetchVideoInfo(); 
  }, []);

  return ( 
    <div className=" flex h-screen w-full overflow-hidden"> 
    {
      !isSidebarStatus &&(<Sidebar1/> )
    }
       
     
      <div className="  mt-5 flex-1 h-full overflow-y-auto bg-white text-black">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading 
              ? Array.from({ length: 20 }).map((_, i) => (
                  <HomeLongVideoSkeleton key={i} />
                )) 
              :( 
                Array.isArray(videoInfo) && videoInfo.length > 0 ?
                videoInfo.map((video) => (
                  <HomeLongVideoCard key={video._id} data={video} />
                ))
              :(<p
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

export default HomePage;

const HomeLongVideoSkeleton = () => {
  return (
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
};