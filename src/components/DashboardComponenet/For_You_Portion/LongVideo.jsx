
import React from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from 'react-router-dom';

const LongVideo = ({video}) => {
  return (
    <Link to = {`/watch/?v=${video._id}`}>

    <div className='h-full w-[360px]  shadow-md rounded-md'>
         <div className='h-[200px] object-cover overflow-hidden w-full rounded-lg'>
           <video 
           className=' h-full object-fill overflow-hidden w-full'
           src={video.videoFile}
           poster={video.thumbnail}
           controls={false}
           />
         </div>
         <div className='w-full h-auto flex flex-col  mt-3'>
           <div className='flex justify-between '>
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
      </Link>
  )
}

export default LongVideo
