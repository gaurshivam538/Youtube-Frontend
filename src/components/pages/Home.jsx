import React, { useEffect, useState } from 'react';
import { getAllVideos } from '../../services/video.service';
import {HomeLongVideoCard} from '../VideoCard/homeLongVideoCard';
import HomeShortVideoCard from '../VideoCard/homeShortVideoCard';

function HomePage() {
  const [videoInfo, setVideoInfo] = useState([]);
  const [shortVideoInfo, setshortVideoInfo] = useState([]);
  const [longVideoInfo, setlongVideoInfo] = useState([]);
  useEffect(() => {

    const fetchVideoInfo = async () => {
      const response = await getAllVideos();
      setVideoInfo(response);
      const shortVideoRes = response.filter((v) => v.category === "short")
      setshortVideoInfo(shortVideoRes);
      const longVideoRes = response.filter((v) => v.category === "long");
      setlongVideoInfo(longVideoRes)
      
    }
    fetchVideoInfo();
    // return () => {
      
    // };
  }, []);
  return (
    <div className='m-6 flex flex-col bg-white text-black'>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4'>
      {
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
