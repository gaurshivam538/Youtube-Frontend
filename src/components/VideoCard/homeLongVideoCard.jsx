import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Hls from "hls.js";

function HomeLongVideoCard({ data }) {
  const time = timingFormat(data.duration);
  const videoRef = useRef(null);

  // useEffect(() => {
  //   if (!data?.videoFile || !videoRef.current) return;

  //   const video = videoRef.current;
  //   // video.addEventListener("progress", () => {
  //   //   if (video.buffered.length > 0) {
  //   //     console.log(
  //   //       "Buffered till:",
  //   //       video.buffered.end(0),
  //   //       "seconds"
  //   //     );
  //   //   }
  //   // });
  //   const hlsUrl = data.videoFile; // must be .m3u8

  //   if (Hls.isSupported()) {
  //     const hls = new Hls({
  //       lowLatencyMode: true,
  //     });

  //     hls.loadSource(hlsUrl);
  //     hls.attachMedia(video);

  //     return () => hls.destroy();
  //   } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
  //     // Safari fallback
  //     video.src = hlsUrl;
  //   }
  // }, [data.videoFile]);
  // let myDate = new Date();
//   console.log(myDate.toString());
// console.log(myDate.toDateString());
// console.log(myDate.toLocaleDateString());
// console.log(myDate.toLocaleTimeString());

  // let date = new Date(data.createdAt);
  // let hai = timeAgo(data.createdAt);

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
          <span className="absolute bottom-2 right-2  bg-slate-200 text-xs px-1 py-0.5 rounded-md">
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
              {data.views} views • {timeAgo(data.createdAt)}
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

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = second < 10 ? `0${second}` : second;

  if (hours > 0) {
    return `${hours}:${m}:${s}`;

  } return `${m}:${s}`;
}


function timeAgo(dateInput) {
  const now = new Date();
  const past = new Date(dateInput);
  const seconds = Math.floor((now - past) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export {
  HomeLongVideoCard,
  timingFormat,
  timeAgo
};
