
import axios from "axios";

const addCommentVideo = async (content, videoId) => {
    try {

        if (!videoId) return;

        const res = await axios.post(`/api/v1/users/add-comment/${videoId}`,
            { content },
            {
                withCredentials: true,
            })
        return res;
    } catch (error) {
        console.log(error)
    }
}

const addCommentForSpecificComment = async (content, videoId, commentId) => {
    try {
        if (!videoId || !commentId) return;

        const res = await axios.post(`/api/v1/users/add-comment/${videoId}`, {
            content, commentId
        },
            {
                withCredentials: true,
            })

            return res;
    } catch (error) {
        console.log(error);
    }
}

const getAllCommentsSpecificVideo = async (videoId) => {
    try {
        console.log(videoId);
        const res = await axios.get(`/api/v1/users/get-video-comments/${videoId}`,
            {
                withCredentials: true,
            }
        )
       
        return res?.data?.comments;
    } catch (error) {
        console.log(error)
    }
}

export {
    addCommentVideo,
    getAllCommentsSpecificVideo,
    addCommentForSpecificComment
}