import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Hls from "hls.js";
import { getSpecificVideo } from "../../services/video.service";
import { Loader } from "../index";
import { timingFormat } from "./homeLongVideoCard";

import { FaPlay, FaPause } from "react-icons/fa";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

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
    <div className="w-full bg-black">
      <div
        className="relative w-full h-[220px] sm:h-[400px] md:h-[520px] lg:h-[600px]"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* VIDEO */}
        <video
          ref={videoRef}
          poster={videoInfo.thumbnail}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-contain"
        />

        {/* BUFFER LOADER */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <Loader />
          </div>
        )}

        {/* PROGRESS BAR */}
        {showControls && (
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="absolute bottom-12 left-0 w-full h-1 bg-gray-600 cursor-pointer"
          >
            <div
              className="h-full bg-white"
              style={{ width: `${buffered}%` }}
            />
            <div
              className="absolute top-0 h-full bg-red-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* CONTROLS BAR */}
        {showControls && (
          <div className="absolute bottom-0 left-0 w-full px-4 py-2 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent text-white">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <button onClick={togglePlay}>
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={18} />}
              </button>

              <button onClick={toggleVolume}>
                {isMuted ? (
                  <HiSpeakerXMark size={22} />
                ) : (
                  <HiSpeakerWave size={22} />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                onChange={(e) =>
                  (videoRef.current.volume = e.target.value)
                }
                className="w-24 accent-red-600"
              />

              <span className="text-sm text-gray-300">
                {currTime} / {totalTime}
              </span>
            </div>

            {/* RIGHT (Future buttons) */}
            <div className="flex items-center gap-4 text-sm">
              <button className="hover:text-red-500">⚙️</button>
              <button className="hover:text-red-500">⛶</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainLongVideoCard;
