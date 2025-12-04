
import React from 'react'
import LongVideo from './VideoType/LongVideo'

const DashboardVideoPortion = ({data}) => {
// console.log(data)
  const setVideo = Array.isArray(data)?data:[]
// console.log(setVideo)
  return (
    <div className='w-full h-full '>
    <div className=' flex lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2  '>
      {
        setVideo.map((video) => (
          <div className='' key={video._id}>
          {video.category == "video" &&(
            <LongVideo video ={video}/>
          )}
          </div>
        ))
      }
    </div>
    </div>
  )
}

export default DashboardVideoPortion
