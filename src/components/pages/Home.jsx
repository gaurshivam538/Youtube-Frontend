import React, { useEffect, useState } from 'react';
import { getAllVideos } from '../../services/video.service';
import {HomeLongVideoCard} from '../VideoCard/homeLongVideoCard';
import HomeShortVideoCard from '../VideoCard/homeShortVideoCard';
import { useSelector } from 'react-redux';

function HomePage() {
  const [videoInfo, setVideoInfo] = useState([]);
  const [shortVideoInfo, setshortVideoInfo] = useState([]);
  const [longVideoInfo, setlongVideoInfo] = useState([]);
  const [loading, setLoading] = useState(true);
     const userData = useSelector((state) => state.auth.userData);
    console.log(userData)
  useEffect(() => {
  const fetchVideoInfo = async () => {
    try {
      setLoading(true);
      const response = await getAllVideos();

      setVideoInfo(response);

      setshortVideoInfo(
        response.filter((v) => v.category === "short")
      );

      setlongVideoInfo(
        response.filter((v) => v.category === "long")
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchVideoInfo();
}, []);

  return (
    <div className='m-6 flex flex-col bg-white text-black'>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4'>
      {
        loading ?Array.from({length: 6}).map((_, i) => (
          <HomeLongVideoSkeleton key={i}/>
        )):
        videoInfo.map((video) => {
          return(
            <div key = {video._id} className=''>
          <HomeLongVideoCard data = {video} key = {video._id}/>
         </div>
          )
        })
      }
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5   '>
       <HomeShortVideoCard/>
       <HomeShortVideoCard/>
       <HomeShortVideoCard/>
       <HomeShortVideoCard/>
     
      </div>
      
    </div>
  );
}

export default HomePage;

const HomeLongVideoSkeleton = () => {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-56 bg-gray-300 rounded-lg"></div>
      <div className='w-full flex items-center  gap-3'>
        <div className='w-10 h-10 rounded-full bg-gray-300'></div>
        <div className='flex flex-col gap-y-2 w-full'>
          <div className="h-6 bg-gray-300 rounded w-4/5"></div>
         <div className="h-6 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
      
    </div>
  );
};

