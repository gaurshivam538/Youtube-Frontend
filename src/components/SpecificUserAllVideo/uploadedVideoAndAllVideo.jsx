import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { userDashboard as getAllFiles } from "../../services/user.service";
import { useSelector, useDispatch } from "react-redux";
import { getSpecificVideo } from "../../services/video.service";
import { processingComplete, removeUpload } from "../../store/upload.slice";
import { Link ,useNavigate} from "react-router-dom";

const UploadedVideoAndAllVideo = () => {
  const [params] = useSearchParams();
  const username = params.get("username");
  const dispatch = useDispatch();
  const [videoInfo, setVideoInfo] = useState([]);
  const uploadData = useSelector((state) => state.upload.uploads);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllFiles(username);
      if (response?.status === 200) {
        setVideoInfo(response.data.data.vc);
      }
    };
    fetchData();
  }, [username]);


  useEffect(() => {
    uploadData.forEach(async (u) => {
      if (u.status === "processing") {
        const res = await getSpecificVideo(u.videoId);

        if (res._id) {
          dispatch(processingComplete({ id: u.videoId }));
        }

        setTimeout(() => {
          dispatch(removeUpload({
            id: u.videoId,
          }))
        }, 5000);
      }

    });
  }, [uploadData]);


  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* 🔴 Uploading / Processing Section */}
      {uploadData.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Uploading Videos
          </h2>

          <div className="space-y-4">
            {uploadData.map((u) => (
              <div
                key={u.id}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{u.title}</h4>
                  <StatusBadge status={u.status} />
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {u.progress}% completed
                </p>

                {u.status === "error" && (
                  <p className="text-red-500 text-sm mt-1">
                    {u.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🟢 Uploaded Videos Section */}
      <h2 className="text-xl font-semibold mt-10 mb-4">
        Uploaded Videos
      </h2>

      {videoInfo.length === 0 && (
        <p className="text-gray-500">No videos uploaded yet.</p>
      )}

      <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      
      >
        {videoInfo.map((video) => (
          <Link to ={`/watch/?v=${video._id}`}>
          <div
            key={video._id}
            className="bg-white border rounded-lg shadow-sm overflow-hidden"
            // onClick={()=>navigate(`/watch/v=${video._id}`)}
          >
            <video
              controls
              className="w-full h-48 object-cover bg-black"
              src={video.videoFile}
            />

            <div className="p-4">
              <h4 className="font-medium truncate">
                {video.title}
              </h4>

              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                  Ready
                </span>
              </div>
            </div>
          </div>
           </Link>
        ))}
        
      </div>
      

    </div>
  );
};
const StatusBadge = ({ status }) => {
  const base = "px-2 py-1 text-xs rounded font-medium";

  if (status === "uploading")
    return <span className={`${base} bg-blue-100 text-blue-700`}>Uploading</span>;

  if (status === "processing")
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Processing</span>;

  if (status === "ready")
    return <span className={`${base} bg-green-100 text-green-700`}>Ready</span>;

  if (status === "error")
    return <span className={`${base} bg-red-100 text-red-700`}>Error</span>;

  return null;
};


export default UploadedVideoAndAllVideo;
