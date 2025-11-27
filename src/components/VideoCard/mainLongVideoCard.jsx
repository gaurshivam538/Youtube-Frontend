import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getSpecificVideo } from "../../services/video.service";
import { timingFormat } from "./homeLongVideoCard";
import { FaPlay } from "react-icons/fa";
import { HiSpeakerWave } from "react-icons/hi2";

function MainLongVideoCard() {
  const [params] = useSearchParams();
  const videoId = params.get("v");
  const [videoInfo, setVideoInfo] = useState({});

  useEffect(() => {
    const fetchVideoInfo = async () => {
      const response = await getSpecificVideo(videoId);
      setVideoInfo(response);
    };

    if (videoId) fetchVideoInfo();
  }, [videoId]);
  const time = timingFormat(videoInfo.duration);

  return (
<div className="w-full h-full mt-3">
  <div className="relative w-[80%] mx-auto aspect-video rounded-xl overflow-hidden">
    <video
      poster={videoInfo.thumbnail}
      src={videoInfo.videoFile}
      controls ={false}
      className="w-full h-full object-fill"
    />
    <div className="  absolute bottom-14 border h-1  bg-gray-500 rounded-lg left-3  overflow-hidden object-cover mx-auto border-gray-500  w-[98%] z-10"></div>
    <div className="pl-3">
         <span className="absolute bottom-2 left-4 mt-2 bg-[#333536]   text-md px-3 py-3  rounded-full">
          <FaPlay />
        </span>
         <span className="absolute bottom-2 left-[70px] mt-2 bg-[#333536]  text-md px-3 py-3  rounded-full">
         <HiSpeakerWave />
        </span>
     <span className="absolute bottom-[6px] left-32 mt-2 bg-[#333536] text-md px-3 py-2  rounded-full">
          {`${time} / ${time}`}
        </span>
    </div>
    <div className=" absolute h-[18px] rounded-full w-[18px] bottom-[50px] left-[10px] z-50 bg-[#f50505]"></div>
  </div>

</div>

  );
}

export default MainLongVideoCard;
