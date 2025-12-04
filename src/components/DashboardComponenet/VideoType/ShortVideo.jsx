
import React from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";

const ShortVideo = ({video}) => {

  return (
    <div className='h-full w-[210px] rounded-md overflow-hidden object-cover shadow-md'>
       <div className='h-[315px] object-fill overflow-hidden w-full rounded-lg '>
              <video 
              className='h-full object-cover w-full '
              src={video.videoFile}
              poster={video?.thumbnail || ""}
              />
            </div>
            <div className=' w-[150px] h-auto flex flex-col  mt-3'>
              <div className='flex gap-x-2 '>
                  <div className=''>
                      <h2>{video.title}</h2>
                  </div>
                  <div className='mt-2'>
                      <BsThreeDotsVertical />
                  </div>
              </div>
              <div>{video.views} views</div>
            </div>
    </div>
  );
}

export default ShortVideo;
