import axios from "axios";

const serverUrl = import.meta.env.VITE_BACKEND_SERVER_URL;


const getAllVideos = async () => {
    try {
        const response = await axios.get(
            `${serverUrl}/get-all-files`,
            { withCredentials: true },

        )
        return response.data.videos

    } catch (error) {
        console.log(error);
    }
}

const uploadVideo = async (title, description, videoFile, thumbnail, category, isPublished) => {
    
    try {
        const response = await axios.post(
            `${serverUrl}/upload-file`,

            {
                title, description, videoFile, thumbnail, category, isPublished
            },
            {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials:true

            },
        )
        return response;
    } catch (error) {
        
    }
}

const getSpecificVideo = async (videoId) => {
    try {
        const response = await axios.get(`
            ${serverUrl}/get-specific-video/${videoId}`,
            { withCredentials: true },
        )

        return response.data.data[0];
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