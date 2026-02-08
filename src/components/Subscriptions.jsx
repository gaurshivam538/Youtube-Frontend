import React from 'react';
import { useSelector } from 'react-redux';
const Subscriptions = () => {
    const [videoInfo, setVideoInfo] = useState([]);
    const authData = useSelector((state) => state.auth.userData);

   useEffect(() => {
    const fetchData = () => {
   let res = getVideoBySubscribedChannel(authData?._id);
   setVideoInfo()
    }
    fetchData();
  }, []);
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

export default Subscriptions;
