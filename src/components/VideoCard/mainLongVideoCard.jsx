import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getSpecificVideo } from "../../services/video.service";
import { Loader } from "../index"
import { timingFormat } from "./homeLongVideoCard";
import { FaPlay } from "react-icons/fa";
import { HiSpeakerWave } from "react-icons/hi2";
import { HiSpeakerXMark } from "react-icons/hi2";
import { FaPauseCircle } from "react-icons/fa";
import { useRef } from "react";
import Hls from "hls.js";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

function MainLongVideoCard() {
  const [params] = useSearchParams();
  //This is the basic command that i can copy the location of the current presenting page
  // const location = useLocation();
  // console.log(location)
  // console.log(window.location.href);

  const videoId = params.get("v");
  const [videoInfo, setVideoInfo] = useState({});
  const [isPlaying, setisPlaying] = useState(false);
  const [currTime, setcurrTime] = useState("00/00");
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [buffered, setBuffered] = useState(0);

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const handleWaiting = () => {
      setIsBuffering(true);
    }

    const handlePlaying = () => {
      setIsBuffering(false);
    }

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        console.log("video buffered", bufferedEnd)
        const duration = video.duration;
        setBuffered((bufferedEnd / duration) * 100);
      }
    }

    video.addEventListener("waiting", handleWaiting);//this event listener track the chunks is they can not present memory then run
    video.addEventListener("playing", handlePlaying);//this event listener track the chunks for the memory then present memory stack
    video.addEventListener("progress", handleProgress);

    return () => {
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("progress", handleProgress);
    }
  }, [])

  useEffect(() => {
    const fetchVideoInfo = async () => {
      const response = await getSpecificVideo(videoId);
      setVideoInfo(response);
    };

    if (videoId) fetchVideoInfo();
  }, [videoId]);

  const time = timingFormat(videoInfo.duration);

  const toggleClick = () => {

    if (!isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }

    setisPlaying(!isPlaying);
  }
  useEffect(() => {
    if (!videoInfo.videoFile || !videoRef.current) return;

    const video = videoRef.current;
    const hlsUrl = videoInfo.videoFile;

    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
      });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      //Safari fallback
      video.scr = hlsUrl;
    }

  }, [videoInfo.videoFile]);

  // const video = videoRef.current;
  // video.addEventListener("progress", () => {
  //   if (video.buffered.length > 0) {
  //     console.log(
  //       "Buffered till:",
  //       video.buffered.end(0),
  //       "seconds"
  //     );
  //   }
  // })


  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const currentTime = Math.floor(video.currentTime)

    setcurrTime(timingFormat(currentTime));

    const percent = (video.currentTime / videoInfo.duration) * 100
    setProgress(percent)

  }
  const progressRef = useRef();
  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = progressRef.current.getBoundingClientRect();//Takethis function when my browser element excet position of the top,left,right,bottom
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * videoInfo.duration
    video.currentTime = newTime;

  }

  const toggleVolume = () => {
    if (!videoRef) {
      return;
    }
    const newMuteState = !videoRef.current.muted;
    videoRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
  }


  return (
    <div className="w-full h-full ">
      <div className="relative w-full  overflow-hidden">
        <video
          poster={videoInfo.thumbnail}
          controls={false}
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-fill"
        />

        {isBuffering ?(
             <div
          className="absolute z-40 bottom-[50%] left-[50%] w-[10%]"
        >
        <Loader />
        </div>
          ):null
         }
        {/* Seekbar */}
        <div
          className="absolute bottom-14 h-1 bg-gray-500 rounded-lg left-1 w-[98%] z-10 cursor-pointer"
          onClick={handleSeek}
          ref={progressRef}
        >

          {/* BUFFER (white) */}
          <div
            className="absolute top-0 left-0 h-1 bg-white rounded z-10"
            style={{ width: `${buffered}%` }}
          />

          {/* PLAYED (red) */}
          <div
            className="absolute top-0 left-0 h-1 bg-red-600 rounded z-20"
            style={{ width: `${progress}%` }}
          />

          {/* THUMB */}
          <div
            className="absolute h-4 w-4 bg-red-700 rounded-full -top-[7px] z-30"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Play,Pause,Specker and timing section */}
        <div className="pl-3">
          <span className="absolute bottom-2 left-4 mt-2 bg-[#333536]   text-md  rounded-full">
            <button onClick={toggleClick} className="w-full h-full rounded-full px-3 py-3 ">
              {
                isPlaying ? <FaPauseCircle /> : <FaPlay />
              }

            </button>

          </span>
          <span className="absolute bottom-2 left-[70px] mt-4 bg-[#4a4843] hover:bg-[#333536] text-md px-3 py-3 flex flex-row rounded-full cursor-pointer">
            {isMuted ? (
              <HiSpeakerXMark className="ml-2 mr-4" onClick={toggleVolume} />
            ) : (
              <HiSpeakerWave className="ml-2 mr-4" onClick={toggleVolume} />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              onChange={(e) => {
                videoRef.current.volume = e.target.value;
              }}
              className="w-28"
            />
          </span>
          <span className="absolute bottom-[6px] left-64 mt-2 bg-[#333536] text-md px-3 py-2  rounded-full">
            {`${currTime} / ${time}`}
          </span>
        </div>
      </div>

    </div>

  );
}

export default MainLongVideoCard;
