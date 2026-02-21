import axios from "axios";

const serverUrl = import.meta.env.VITE_BACKEND_SERVER_URL;


const getAllVideos = async (pageNum) => {
    try {
        const response = await axios.get(
            `/api/v1/users/get-all-files?page=${pageNum}&limit=3`,
            { withCredentials: true },

        )
        console.log(response);
        // return response.data.videos
        return response;

    } catch (error) {
        console.log(error);
    }
}

const uploadVideo = async (title, description, videoFile, thumbnail, category, isPublished, onProgress) => {
    
    try {
        const response = await axios.post(
            `/api/v1/users/upload-file`,

            {
                title, description, videoFile, thumbnail, category, isPublished
            },
            {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials:true,
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded)*100/progressEvent.total
                        );
                        onProgress(percent);
                    }
            },
        )
        
        return response;
    } catch (error) {
        return error
    }
}

const getSpecificVideo = async (videoId, signal) => {
    try {
        const res = await axios.get(`
            /api/v1/users/get-specific-video/${videoId}?signal=${signal}`,
            { withCredentials: true },
        )
        return res.data.data[0];
    } catch (error) {
        console.log("Error comes to fetch the video by id ", error);
        return error;
    }
}

const getVideoBySubscribedChannel = async (channelId) => {
    if (!channelId) {
        console.log("ChannelId is required");
        return;
    }
    try {
        const res = await axios.get(`/api/v1/users/get-subscribed-channel-video/${channelId}`,
            {
                withCredentials: true,
            }
        )
        console.log(res);
        return res;
        
    } catch (error) {
        console.log(error);
        return error;
    }
}


export {
    getAllVideos,
    uploadVideo,
    getSpecificVideo,
    getVideoBySubscribedChannel,
}