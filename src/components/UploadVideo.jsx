import { useForm } from "react-hook-form";
import { Input } from "./index"
import { uploadVideo } from "../services/video.service";
import { Navigate, useNavigate } from "react-router-dom";

const UploadVideo = () => {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        
        const result = await uploadVideo(data.title, data.description, data.video[0],data.thumbnail[0], data.category, data.isPublished);
        if (result.status == 200) {
            reset();
           navigate("/");
        }

    }


    const videoFormat = ["video/mp4", "video/webm", "video/ogg", "video/mov", "video/mkv"];
    const thumbnailFormat = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form onSubmit={handleSubmit(onSubmit)} className="">
            {/* register your input into the hook by invoking the "register" function */}
            <div className="flex flex-col w-[70%] lg:w-[50%] h-1/2 mx-auto shadow-md my-4   p-6 rounded-lg">
                <div className="mb-3">
                    <Input
                        type="file"
                        lable="VideoFile"
                        placeholder="Upload File"
                        className = "shadow-sm"
                        {
                        ...register("video", {
                            required: "Please Upload a video",
                            validate: {
                                checkFormat: (value) => {
                                    const file = value[0];
                                    if (!file) {
                                        return "Please Select a File"
                                    }
                                    if (!videoFormat.includes(file.type)) {
                                        return "Please Upload  only this type formated -> mp4, webm, ogg", "mov", "mkv";
                                    }
                                    return true;
                                }
                            }
                        }

                        )}

                    />


                    {
                        errors.video && (
                            <p className="text-red-500 bg-gray-200 mt-2">{errors.video.message}</p>
                        )
                    }
                </div>
                <div className="mb-3">
                    <Input
                        lable="Thumbnail"
                        type="file"
                        placeholder="Upload File"
                        className = "shadow-sm"

                        {
                        ...register("thumbnail", {
                            validate: {
                                checkFormat: (value) => {
                                    const file = value[0];
                                    if (!file) {
                                        return true
                                    }
                                    if (!thumbnailFormat.includes(file.type)) {
                                        return "Please Upload  only this type formated -> jpg, jpeg ,png, webp";
                                    }
                                    return true;

                                }
                            }
                        }

                        )}

                    />


                    {
                        errors.thumbnail && (
                            <p className="text-red-500 bg-gray-200 mt-2">{errors.video.message}</p>
                        )
                    }
                </div>

                {/* include validation with required or other standard HTML validation rules */}
                <div className="mb-3">
                    <Input
                        lable="Title"
                        type="text"
                        className = "shadow-sm bg-transparent"

                        placeholder="Enter your video title "
                        {...register("title", { required: true })} />
                    {/* errors will return when field validation fails  */}
                    {errors.title && <span className="text-red-500 mt-2 rounded">This field is required</span>}
                </div>

                <div className="mb-3 shadow-sm">
                    <Input
                        lable="Description"
                        type="text"
                        className = "bg-transparent"
                        placeholder="Enter your video description"
                        {...register("description", { required: true })} />
                    {/* errors will return when field validation fails  */}
                    {errors.title && <span className="mt-2 text-red-500">This field is required</span>}
                </div>
                <div className="bg-transparent ">
                    <span className="mx-2">Category</span>
                    <select
                        className="w-full rounded-md mb-3 p-2 shadow-sm"
                        {
                        ...register("category",
                            {
                                required: "Category is required"
                            }
                        )
                        }
                    >
                        <option value="">Select a Category</option>
                        <option value="short">Short</option>
                        <option value="video">Video</option>
                    </select>
                    {
                        errors.category && (
                            <span className="text-red-500 mb-2">This field is required</span>
                        )
                    }
                </div>
                <div className="flex w-full  mb-3 bg-slate-400 p-2 rounded-md">
                    <div className="flex items-center w-1/2">
                          <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                            type="radio"
                            value="true"
                            {...register("isPublished")}
                        />
                         <span>Public</span>
                        </label>
                    </div>

                    <div className="flex items-end w-1/2">
                                                  <label className="flex items-center gap-2 cursor-pointer">

                        <Input
                            type="radio"
                            value="false"
                            {...register("isPublished")}
                        />
                        <span>Private</span>
                        </label>
                    </div>

                </div>


                <input type="submit" className="mb-3 bg-blue-500 rounded-md px-4 py-2 hover:bg-blue-600 hover:px-[18px] hover:py-[10px]" />

            </div>
        </form>
    );
}

export default UploadVideo;
