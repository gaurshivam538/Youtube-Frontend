import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getSpecificVideo } from "../../services/video.service";
import { timingFormat } from "./homeLongVideoCard";
import { FaPlay } from "react-icons/fa";
import { HiSpeakerWave } from "react-icons/hi2";
import { HiSpeakerXMark } from "react-icons/hi2";
import { FaPauseCircle } from "react-icons/fa";
import { useRef } from "react";
import { useLocation } from "react-router-dom";

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

  useEffect(() => {
    const fetchVideoInfo = async () => {
      const response = await getSpecificVideo(videoId);
      setVideoInfo(response);
    };

    if (videoId) fetchVideoInfo();
  }, [videoId]);

  const time = timingFormat(videoInfo.duration);
  const videoRef = useRef(null);

  const toggleClick = () => {

    if (!isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }

    setisPlaying(!isPlaying);
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const currentTime = Math.floor(video.currentTime)

    setcurrTime(timingFormat(currentTime));

    const percent = (video.currentTime / videoInfo.duration) * 100
    setProgress(percent)

  }
  const progressRef = useRef();
  const handleSeek = (e) => {
    console.log(e)
    const video = videoRef.current;
    const rect = progressRef.current.getBoundingClientRect();//Takethis function when my browser element excet position of the top,left,right,bottom
    console.log(progressRef.current)
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
    <div className="w-full h-full mt-3">
      <div className="relative w-[80%] mx-auto aspect-video rounded-xl overflow-hidden">
        <video
          poster={videoInfo.thumbnail}
          src={videoInfo.videoFile}
          controls={false}
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-fill"
        />
        {/* Seekbar */}
        <div
          className=" absolute bottom-14 border h-1  bg-gray-500 rounded-lg  left-1  object-cover mx-auto border-gray-500  w-[98%] z-10"
          onClick={handleSeek}
          ref={progressRef}
        >
          <div
            className="h-full z-20 bg-red-600 rounded" style={{ width: `${progress}%` }}>
          </div>
          <div
            className="h-4 w-4  bg-red-700 rounded-full absolute -top-[7px]"
            style={{ left: `calc(${progress}% - 6px)` }}   // center it
          ></div>
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
          <span className="absolute bottom-2 left-[70px] mt-4 bg-[#4a4843] hover:bg-[#333536]  text-md px-3 py-3 flex flex-row rounded-full">
            {isMuted ? (
              <HiSpeakerXMark  className="ml-2 mr-4" onClick={toggleVolume} />
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
