import React, { useEffect, useState } from 'react';
import VideoCard from '../VideoCard';
import { getAllVideos } from '../../services/video.service';

function HomePage() {
  const [videoInfo, setVideoInfo] = useState([]);
  useEffect(() => {

    const fetchVideoInfo = async () => {
      const response = await getAllVideos();
      setVideoInfo(response)
    }
    fetchVideoInfo();
    // return () => {
      
    // };
  }, []);
  console.log(videoInfo)
  return (
    <div className='m-6 flex flex-col bg-white'>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4'>
      {
        videoInfo.map((video) => {
          return(
            <div key = {video._id} className='h-1/4'>
          <VideoCard data = {video} key = {video._id}/>
         </div>
          )
        })
      }
      </div>
    </div>
  );
}

export default HomePage;
