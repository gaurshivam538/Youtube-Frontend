import { useForm } from "react-hook-form";
import { Input } from "./index";
import { uploadVideo } from "../services/video.service";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startUpload,
  updateProgress,
  uploadComplete,
  uploadFailed,
} from "../store/upload.slice";
import { v4 as uuidv4 } from "uuid";
import { addNotification } from "../services/notification.service";

const UploadVideo = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth.userData);

  /* ---------- FILE HANDLERS ---------- */

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoPreviewUrl(URL.createObjectURL(file));
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailPreviewUrl(URL.createObjectURL(file));
  };

  /* cleanup object URLs */
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    };
  }, [videoPreviewUrl, thumbnailPreviewUrl]);

  /* ---------- SUBMIT ---------- */

  const onSubmit = async (data) => {
    const uploadId = uuidv4();

    dispatch(startUpload({ id: uploadId, title: data.title }));
    navigate(`/getallfiles?username=${authData.username}`);

    try {
      const result = await uploadVideo(
        data.title,
        data.description,
        data.video[0],
        data.thumbnail?.[0],
        data.category,
        data.isPublished,
        (progress) => {
          dispatch(updateProgress({ id: uploadId, progress }));
        }
      );

      const uploadedVideoId = result.data.data._id;

      dispatch(uploadComplete({
        id: uploadId,
        videoId: uploadedVideoId,
      }));

      if (result.status === 200) {
        await addNotification(
          authData?._id,
          "UPLOAD",
          uploadedVideoId,
          "VIDEO",
          result?.data?.data?.title,
          "New video uploaded",
          result?.data?.data?.thumbnail,
          authData?.avatar
        );
        reset();
        setVideoPreviewUrl(null);
        setThumbnailPreviewUrl(null);
      }

    } catch (err) {
      dispatch(uploadFailed({
        id: uploadId,
        error: err.message
      }));
    }
  };

  const videoFormat = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-matroska"];
  const thumbnailFormat = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col w-[70%] lg:w-[50%] mx-auto shadow-md my-4 p-6 rounded-lg space-y-4">

        {/* VIDEO */}
        <div className="flex h-20 w-30 justify-center">
          {videoPreviewUrl && (
            <video controls src={videoPreviewUrl} className="w-40 mb-2 rounded" />
          )}

          <Input
            type="file"
            {...register("video", {
              required: "Please upload a video",
              validate: (value) => {
                const file = value?.[0];
                if (!file) return "Select a file";
                if (!videoFormat.includes(file.type))
                  return "Only mp4, webm, ogg, mov, mkv allowed";
                return true;
              },
              onChange: handleVideoFileChange
            })}
          />

          {errors.video && (
            <p className="text-red-500 mt-2">{errors.video.message}</p>
          )}
        </div>

        {/* THUMBNAIL */}
        <div className="flex  h-20 ">
          {thumbnailPreviewUrl && (
            <img src={thumbnailPreviewUrl} className=" h-full w-30 mb-2 rounded" />
          )}

          <Input
            type="file"
            {...register("thumbnail", {
              validate: (value) => {
                const file = value?.[0];
                if (!file) return true;
                if (!thumbnailFormat.includes(file.type))
                  return "Only jpg, jpeg, png, webp allowed";
                return true;
              },
              onChange: handleThumbnailFileChange
            })}
          />

          {errors.thumbnail && (
            <p className="text-red-500 mt-2">{errors.thumbnail.message}</p>
          )}
        </div>

        {/* TITLE */}
        <div >
        <Input
          placeholder="Video title"
          
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>
        {/* DESCRIPTION */}
        <div>
        <Input
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>
        {/* CATEGORY */}
        <div>
        <select
          className="w-full rounded-md my-3 p-2 shadow-sm"
          {...register("category", { required: "Category required" })}
        >
          <option value="">Select Category</option>
          <option value="short">Short</option>
          <option value="video">Video</option>
        </select>
        {errors.category && <p className="text-red-500">{errors.category.message}</p>}
        </div>
        {/* VISIBILITY */}
        <div className="flex gap-4 my-3">
          <label className="flex gap-2">
            <input type="radio" value="true" {...register("isPublished")} />
            Public
          </label>
          <label className="flex gap-2">
            <input type="radio" value="false" {...register("isPublished")} />
            Private
          </label>
        </div>

        <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Upload Video
        </button>

      </div>
    </form>
  );
};

export default UploadVideo;