
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

const deleteComment = async(commentId, videoId) => {
    try {
        const res = await axios.delete(`/api/v1/users/delete-comment/${commentId}`,
            {
                data: {videoId},
                withCredentials: true
            }
        )
        console.log(res);
        return res;
    } catch (error) {
        console.log(error)
    }
}
const updateComment = async(content, commentId, videoId) => {
    try {

        if (!commentId && !videoId) {
            console.log("CommentId and VideoId is required");
            return;
        }
        
        const res = await axios.patch(`/api/v1/users/update-comment/${commentId}`,
            {content, videoId},
            {withCredentials: true},
        )
        console.log(res);
        return res;
    } catch (error) {
        console.log(error)
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
    addCommentForSpecificComment,
    deleteComment,
    updateComment
}