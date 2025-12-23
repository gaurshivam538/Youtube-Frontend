import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Hls from "hls.js";

function HomeLongVideoCard({ data }) {
  const time = timingFormat(data.duration);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!data?.videoFile || !videoRef.current) return;

    const video = videoRef.current;
    const hlsUrl = data.videoFile; // must be .m3u8

    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari fallback
      video.src = hlsUrl;
    }
  }, [data.videoFile]);

  return (
    <Link to={`watch/?v=${data._id}`}>
      <div className="w-auto h-full cursor-pointer z-20 pt-2 text-black">
        {/* Thumbnail Box */}
        <div className="relative rounded-xl overflow-hidden aspect-video">
          <video
            ref={videoRef}
            muted
            preload="metadata"
            playsInline
            poster={data.thumbnail}
            className="w-full h-full object-cover"
          />

          {/* Duration Tag */}
          <span className="absolute bottom-2 right-2 bg-black text-xs px-1 py-0.5 rounded-md">
            {time}
          </span>
        </div>

        {/* Video Details */}
        <div className="flex mt-3 gap-3">
          <img
            src={data.owner.avatar}
            alt="channel"
            className="w-9 h-9 rounded-full"
          />

          <div>
            <h3 className="font-semibold text-sm">{data.title}</h3>
            <p className="text-gray-400 text-xs mt-1">
              {data.owner.username}
            </p>
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
