import  axios  from "axios"

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