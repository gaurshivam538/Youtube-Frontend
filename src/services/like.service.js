import axios from "axios"

const toggleUserReaction = async (videoId, userReaction) => {

    try {
        const res = await axios.post(
            `/api/v1/users/v/toggle-like/${videoId}`,
            {
                userReaction,
                withCredentials: true,
            }
        );
        return res
    } catch (error) {

    }
}

const toggleUserReactionForComment = async (commentId, userReaction) => {

    if (!commentId) return;

    try {
        const res = await axios.post(`/api/v1/users/c/toggle-like/${commentId}`, {
            userReaction,
        }, 
        {
            withCredentials: true,
        })

        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
}

const userReactionStatus = async (videoId) => {

    try {
        const res = await axios.get(`/api/v1/users/v/get-status/${videoId}`,
            {
                withCredentials: true,
            }
        )
        return res?.data?.data;
    } catch (error) {
        console.log(error);
    }
}

export {
    toggleUserReaction,
    userReactionStatus,
}