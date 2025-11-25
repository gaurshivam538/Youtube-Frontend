import React from "react";

function VideoCard({ thumbnail, duration, title, channelName, views, time,url }) {
  return (
    <div className="w-80 cursor-pointer">
      {/* Thumbnail Box */}
      <div className="relative">
        <video
          controls
          poster={`${thumbnail}`}
          src={`${url}`}
          className="rounded-xl w-full h-48 object-cover"
        />
        {/* Duration Tag */}
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 py-0.5 rounded">
          {duration}
        </span>
      </div>

      {/* Video Details */}
      <div className="flex mt-3 gap-3">
        {/* Channel Logo */}
        <img
          src=""
          alt="channel"
          className="w-9 h-9 rounded-full"
        />

        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <p className="text-gray-400 text-xs mt-1">{channelName}</p>
          <p className="text-gray-400 text-xs">
            {views} • {time}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
