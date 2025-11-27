import React from "react";
import {Link} from "react-router-dom"

function HomeLongVideoCard({ data }) {
   const time = timingFormat(data.duration)
   
  return (
    <Link to = {`watch/?v=${data._id}`}>
    <div className="w-auto h-full cursor-pointer z-20 pt-2 text-black">
      {/* Thumbnail Box */}
      <div className="relative rounded-xl overflow-hidden aspect-video">
        <video
          content={false}
          poster={`${data.thumbnail}`}
          src={`${data.videoFile}`}
          className=" w-full h-full object-cover"
        />
        {/* Duration Tag */}
        {/* <div className="  absolute bottom-4 border h-1  bg-gray-500 rounded-lg   overflow-hidden object-cover left-6 border-gray-500  w-[80%] z-10"></div> */}
        <span className="absolute bottom-2 right-2 bg-black  text-xs px-1 py-0.5 rounded-md">
          {`${time}`}
        </span>
      </div>

      {/* Video Details */}
      <div className="flex mt-3 gap-3">
        {/* Channel Logo */}
        <img
          src={`${data.owner.avatar}`}
          alt="channel"
          className="w-9 h-9 rounded-full"
        />

        <div>
          <h3 className=" font-semibold text-sm">{data.title}</h3>
          <p className="text-gray-400 text-xs mt-1">{data.owner.username}</p>
          <p className="text-gray-400 text-xs">
            {data.views} • {data.createdAt}
          </p>
        </div>
      </div>
    </div>
    </Link>
  );
}

const timingFormat = (sec) => {
  sec = Math.floor(sec)
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const second = sec % 60;

  const m = minutes < 10 ? `0${minutes}`:minutes;
  const s = second < 10 ? `0${second}`:second;

  if(hours>0){
    return `${hours}:${m}:${s}`;
    
  } return `${m}:${s}`;
}

export {
  HomeLongVideoCard,
  timingFormat
};
