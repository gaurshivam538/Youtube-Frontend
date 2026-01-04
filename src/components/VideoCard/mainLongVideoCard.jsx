import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { getSpecificVideo } from "../../services/video.service";
import { Loader, ProfilePopup } from "../index";
import { timingFormat } from "./homeLongVideoCard";
import { FaPlay, FaPause } from "react-icons/fa";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoReorderThreeSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { RedirectPopup } from "../index"
import { useSelector } from "react-redux";
import LikeAndDislike from "./VideoComponents/LikeAndDislike";
import { toggleUserReaction, userReactionStatus } from "../../services/like.service";


const REDIRECT_DELAY = 6;
function MainLongVideoCard() {
  const [params] = useSearchParams();
  const videoId = params.get("v");
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);

  const [videoInfo, setVideoInfo] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [commentInfo, setCommentInfo] = useState([]);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [currTime, setCurrTime] = useState("00:00");
  const [open, setOpen] = useState(false);
  const [like, setLike] = useState(false);
  const [dislike, setDisLike] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_DELAY);
  /* ================= 1 VIDEO FETCH ================= */
  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      try {
        const res = await getSpecificVideo(videoId);
        setVideoInfo(res);
        setCommentInfo(res.commentInfo);
      } catch (error) {
        if (error.response.status === 401) {
          videoRef.current.pause()
          setShowPopup(true);

          sessionStorage.setItem(
            "postLoginRedirect",
            location.pathname + location.search
          );
        }
      }

    };

    fetchVideo();
  }, [videoId]);

  /*==============VideoLikes set to the LocalState===========*/
  useEffect(() => {

    if (videoInfo?.likes !== undefined) {
      setLikesCount(videoInfo?.likes);
    }
  }, [videoInfo.likes]);


  /* ================= 2 HLS STREAM ATTACH ================= */
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

  /* ================= 3 BUFFERING & PROGRESS ================= */
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

  /* ================= 4 POPUP COUNTDOWN ================= */
  useEffect(() => {
    if (!showPopup) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/login");
          return 0;
        }
        return prev - 1;

      })

    }, 1000);

    return () => clearInterval(interval);
  }, [showPopup, navigate]);

  //================FetchUserReactions================//
  useEffect(() => {
    if (!videoId) return;
    try {
      const fetchUserReaction = async () => {
        const res = await userReactionStatus(videoId);
        setUserReaction(res);

      }
      fetchUserReaction();
    } catch (error) {
      console.log(error)
    }
  }, [videoId]);

  useEffect(() => {
    if (userReaction === "like") {
      setLike(true);
    }

    if (userReaction === "dislike") {
      setDisLike(true);
    }

    if (userReaction === null) {
      setLike(false);
      setDisLike(false);
    }

  }, [userReaction]);

  /* ================= 5 PLAY / PAUSE ================= */
  const togglePlay = () => {

    if (!user) {
      videoRef.current.pause();
      setShowPopup(true);

      sessionStorage.setItem(
        "postLoginRedirect",
        location.pathname + location.search
      );
      return;
    }
    if (!isPlaying) videoRef.current.play();
    else videoRef.current.pause();

    setIsPlaying(!isPlaying);
  };
  /* ================= 6 OTHER FUNCTIONS ================= */
  // Popup close
  const handleClose = () => {
    sessionStorage.removeItem("postLoginRedirect");
    navigate(-1);
  }

  // Login button
  const handleLogin = () => {
    navigate("/login");
  }

  // Mute/Unmute
  const toggleVolume = () => {
    const muted = !videoRef.current.muted;
    videoRef.current.muted = muted;
    setIsMuted(muted);
  };

  // Time update
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    setCurrTime(timingFormat(video.currentTime));
    setProgress((video.currentTime / video.duration) * 100);
  };

  // Seek bar
  const handleSeek = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    videoRef.current.currentTime = percent * videoInfo.duration;
  };

  // Total duration
  const totalTime = timingFormat(videoInfo?.duration || 0);

  const toggleLike = async () => {
    const reaction = "like";
    if (like) {
      setLikesCount(prev => Math.max(prev - 1, 0));
      setLike(false);

    } else {
      if (dislike) {
        setDisLike(false);
      }
      setLikesCount(prev => prev + 1);
      setLike(true);
    }

    try {
      const res = await toggleUserReaction(videoId, reaction)
    } catch (error) {
      console.log(error)
    }

  };
  

  const toggleDislike = async () => {
    const reaction = "dislike";

    if (dislike) {
      setDisLike(false)
      try {
        const res = await toggleUserReaction(videoId, reaction);
      } catch (error) {
        console.log(error);
      }
      return;
    }

    if (like) {
      setLike(false);
      setLikesCount(prev => Math.max(prev - 1, 0));
    }

    setDisLike(true);

    try {
      const res = await toggleUserReaction(videoId, reaction)
      console.log(res);
    } catch (error) {
      console.log(error)
    }

  };


  return (
    <div>
      {
        showPopup ? (<RedirectPopup
          open={showPopup}
          onBack={handleClose}
          onLogin={handleLogin}
          secondsLefts={secondsLeft}
        />) : (<div className="w-full bg-black text-white">

          {/* ================= VIDEO PLAYER ================= */}
          <div
            className="relative w-full h-[220px] sm:h-[400px] md:h-[520px] lg:h-[600px]"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <div>

            </div>
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
              videoInfo?.owner && (
                <div className="flex flex-wrap justify-between items-center gap-4 mt-4">

                  {/* CHANNEL */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600" >
                      {
                        videoInfo?.owner.avatar && (
                          <img
                            src={`${videoInfo.owner.avatar}`}
                            className="object-cover overflow-hidden w-full h-full rounded-full "
                          />
                        )
                      }
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
                    <LikeAndDislike
                      like={like}
                      dislike={dislike}
                      videoInfo={videoInfo}
                      toggleLike={toggleLike}
                      toggleDislike={toggleDislike}
                      likeCount={likesCount}
                    />
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
                    >
                      <IoMdClose
                        className="h-7 w-7"
                      />
                    </h2>
                  ) : (
                    <h2
                      onClick={() => setOpen(true)}
                    ><IoReorderThreeSharp
                        className="h-7 w-7"
                      /></h2>
                  )
                }
              </div>

              <div className="flex gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gray-600" >
                  {
                    user?.avatar && (<img
                      className="w-full h-full object-cover overflow-hidden rounded-full"
                      src={`${user.avatar}`}
                    />)
                  }
                </div>
                <input
                  className="flex-1 bg-transparent border-b border-gray-600 outline-none text-sm"
                  placeholder="Add a comment..."
                />
                <input
                  className="bg-blue-400 rounded-md max-w-fit px-2 py-1"
                  value="Add"
                  type="submit" />
              </div>

              {/* SINGLE COMMENT */}
              {
                open && videoInfo?.owner && commentInfo.length > 0 ? (
                  commentInfo.map((comment) => (
                    <div className="flex gap-3  mb-3" key={comment._id}>

                      <div className="w-9 h-9 rounded-full bg-gray-600" >
                        {
                          comment?.user?.avatar && (<img
                            src={`${comment?.user?.avatar}`}
                            className="h-full w-full rounded-full object-cover overflow-hidden"
                          />)
                        }
                      </div>

                      <div className="flex  w-full justify-between">
                        <div className="flex flex-col ">
                          <p className="text-sm font-medium">{comment.user.username}</p>
                          <p className="text-sm text-gray-300">
                            {comment.content}
                          </p>
                        </div>
                        <div>
                          <BsThreeDotsVertical />
                        </div>
                      </div>

                    </div>
                  ))

                ) : null
              }
            </div>

          </div>
        </div>)

      }
    </div>
  );
}

export default MainLongVideoCard;
