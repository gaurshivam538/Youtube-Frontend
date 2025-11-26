import React from "react";

function VideoCard({ data }) {
  console.log(data)
  return (
    <div className="w-auto h-full cursor-pointer z-20 pt-2 ">
      {/* Thumbnail Box */}
      <div className="relative rounded-xl overflow-hidden aspect-video">
        <video
          controls
          poster={`${data.thumbnail}`}
          src={`${data.videoFile}`}
          className=" w-full h-full object-cover"
        />
        {/* Duration Tag */}
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 py-0.5 rounded-xl">
          {data.duration}
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
          <h3 className="text-white font-semibold text-sm">{data.title}</h3>
          <p className="text-gray-400 text-xs mt-1">{data.owner.username}</p>
          <p className="text-gray-400 text-xs">
            {data.views} • {data.createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
