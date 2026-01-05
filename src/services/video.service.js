import axios from "axios";

const serverUrl = import.meta.env.VITE_BACKEND_SERVER_URL;


const getAllVideos = async () => {
    try {
        const response = await axios.get(
            `/api/v1/users/get-all-files`,
            { withCredentials: true },

        )
        return response.data.videos

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
        
    }
}

const getSpecificVideo = async (videoId) => {
    try {
        const res = await axios.get(`
            /api/v1/users/get-specific-video/${videoId}`,
            { withCredentials: true },
        )
        return res.data.data[0];
    } catch (error) {
        console.log("Error comes to fetch the video by id ", error);
        throw error;
    }
}


export {
    getAllVideos,
    uploadVideo,
    getSpecificVideo
}