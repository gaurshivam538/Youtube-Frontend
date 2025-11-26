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

export {
    getAllVideos,
}