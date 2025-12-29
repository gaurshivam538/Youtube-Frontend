import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Hls from "hls.js";
import { getSpecificVideo } from "../../services/video.service";
import { Loader } from "../index";
import { timingFormat } from "./homeLongVideoCard";
import { FaPlay, FaPause } from "react-icons/fa";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { SlDislike, SlLike } from "react-icons/sl";

function MainLongVideoCard() {
  const [params] = useSearchParams();
  const videoId = params.get("v");

  const [videoInfo, setVideoInfo] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [currTime, setCurrTime] = useState("00:00");
  const [open, setOpen] = useState(false);

  const videoRef = useRef(null);
  const progressRef = useRef(null);


  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      const res = await getSpecificVideo(videoId);
      setVideoInfo(res);
    };

    fetchVideo();
  }, [videoId]);


  useEffect(() => {
    if (!videoInfo?.videoFile || !videoRef.current) return;

    const video = videoRef.current;
    const hlsUrl = videoInfo.videoFile;

    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
    }
  }, [videoInfo]);


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);

    const onProgress = () => {
      if (video.buffered.length) {
        const end = video.buffered.end(video.buffered.length - 1);
        setBuffered((end / video.duration) * 100);
      }
    };

    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("progress", onProgress);

    return () => {
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("progress", onProgress);
    };
  }, []);


  const togglePlay = () => {
    if (!isPlaying) videoRef.current.play();
    else videoRef.current.pause();

    setIsPlaying(!isPlaying);
  };

  const toggleVolume = () => {
    const muted = !videoRef.current.muted;
    videoRef.current.muted = muted;
    setIsMuted(muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    setCurrTime(timingFormat(video.currentTime));
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleSeek = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    videoRef.current.currentTime = percent * videoInfo.duration;
  };

  const totalTime = timingFormat(videoInfo?.duration || 0);


  return (
    <div className="w-full bg-black text-white">

      {/* ================= VIDEO PLAYER ================= */}
      <div
        className="relative w-full h-[220px] sm:h-[400px] md:h-[520px] lg:h-[600px]"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          poster={videoInfo?.thumbnail}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />

        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <Loader />
          </div>
        )}

        {showControls && (
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="absolute bottom-12 left-0 w-full h-1 bg-gray-600 cursor-pointer"
          >
            <div
              className="h-full bg-gray-400"
              style={{ width: `${buffered}%` }}
            />
            <div
              className="absolute top-0 h-full bg-red-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {showControls && (
          <div className="absolute bottom-0 left-0 w-full px-3 sm:px-4 py-2 flex justify-between items-center bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={togglePlay}>
                {isPlaying ? <FaPause size={18} /> : <FaPlay size={16} />}
              </button>

              <button onClick={toggleVolume}>
                {isMuted ? <HiSpeakerXMark size={20} /> : <HiSpeakerWave size={20} />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                onChange={(e) => (videoRef.current.volume = e.target.value)}
                className="hidden sm:block w-24 accent-red-600"
              />

              <span className="text-xs sm:text-sm text-gray-300">
                {currTime} / {totalTime}
              </span>
            </div>

            <div className="flex gap-3">
              <button>⚙️</button>
              <button>⛶</button>
            </div>
          </div>
        )}
      </div>

      {/* ================= VIDEO INFO ================= */}
      <div className="w-full mx-auto  px-3 sm:px-4 py-4">

        <h1 className="text-base sm:text-lg md:text-xl font-semibold">
          {videoInfo.title}
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          {videoInfo.views} views • {videoInfo.createdAt}
        </p>

        {/* ACTION BAR */}
        {
          videoInfo?.owner &&(
 <div className="flex flex-wrap justify-between items-center gap-4 mt-4">

          {/* CHANNEL */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600" >
              <img
                src={`${videoInfo.owner.avatar}`}
                className="object-cover overflow-hidden w-full h-full rounded-full "
              />
            </div>

            <div>
              <p className="text-sm font-medium">{videoInfo.owner.username}</p>
              <p className="text-xs text-gray-400">
                {/* {videoInfo.subscribers} subscribers */}
              </p>
            </div>
            <button className="ml-3 bg-red-600 px-4 py-1 rounded-full text-sm">
              Subscribe
            </button>
          </div>

          {/* LIKE / DISLIKE */}
          <div className="flex gap-2">
            <div className="bg-[#272727] px-4 py-2 rounded-full text-sm flex justify-center">
            <button className=" mr-4">
              <div className="flex justify-center gap-2">
               <SlLike 
               className="h-5 w-5"
               />
               <p
               className="text-md text-bol"
               >{videoInfo.likes}</p>

              </div>
            </button>
            <button className="">
              <SlDislike 
              className="h-5 w-5"
              />
            </button>
            </div>
            <button className="bg-[#272727] px-4 py-2 rounded-full text-sm">
              Share
            </button>
          </div>

        </div>
          )
        }
       

        {/* DESCRIPTION */}
        <div className="mt-4 bg-[#272727] rounded-xl p-4 text-sm text-gray-300">
          {videoInfo.description}
        </div>

        {/* ================= COMMENTS ================= */}
        <div className="mt-6">
          <div className="flex justify-between">
            <h2 className="text-sm sm:text-base font-semibold mb-3">
              Comments
            </h2>
            {
              open ? (
                <h2
                  onClick={() => setOpen(false)}
                >Close</h2>
              ) : (
                <h2
                  onClick={() => setOpen(true)}
                >Open</h2>
              )
            }
          </div>

          <div className="flex gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gray-600" />
            <input
              className="flex-1 bg-transparent border-b border-gray-600 outline-none text-sm"
              placeholder="Add a comment..."
            />
          </div>

          {/* SINGLE COMMENT */}
          {
            open ? (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-600" />
                <div>
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-sm text-gray-300">
                    Very nice video 🔥
                  </p>
                </div>
              </div>
            ) : null
          }
        </div>

      </div>
    </div>

  );
}

export default MainLongVideoCard;
