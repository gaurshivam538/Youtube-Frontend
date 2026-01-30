import axios from "axios"

const getUserChannelSubscribed = async(channelId) => {

    if (!channelId) {
        console.log("Channel Id is required");
        return;
    }

    try {
        
        const res = await axios.get(`/api/v1/users/get-subscriber/${channelId}`,
            {
                withCredentials: true,
            },
        )

        console.log(res);
        return res;
    } catch (error) {
        console.log("getUserChannelSubscribed ApiError ->",error);
        return error;
    }
}

const getSubsribedChannel = async(subscriberId) => {

    if (!subscriberId) {
        console.log("Subscriber id is required");
        return;
    }

    try {
        
        const res = await axios.get(`/api/v1/users/get-subscribed/${subscriberId}`,
            {
                withCredentials: true,
            }
        )

        console.log(res);
        return res;
    } catch (error) {
        console.log("Subscribed channel ApiError ->",error)
        return;
    }
}

const toggleSubscriber = async(channelId) => {

    if (!channelId) {
        console.log("ChannelId is required");
        return;
    }
    try {
        
        const res = await axios.post(`/api/v1/users/toggle-subscriber/${channelId}`,
            {},
            {
                withCredentials: true,
            },
        );

        console.log(res);
        return res;
        
    } catch (error) {
        console.log("Toggle subscriber ApiError ->",error);
        return;
    }
}

const subscribedStatus = async(channelId) => {
    if (!channelId) {
        console.log("channelId is required");
        return;
    }

    try {
      
        const res = await axios.get(`/api/v1/users/get-subscribed-status/${channelId}`,
            {
                withCredentials: true
            },
        );

        console.log(res);
        return res;
    } catch (error) {
        console.log("getStatusApi Error->",error)
        return error
    }
}

export {
    getUserChannelSubscribed,
    getSubsribedChannel,
    toggleSubscriber,
    subscribedStatus,
}