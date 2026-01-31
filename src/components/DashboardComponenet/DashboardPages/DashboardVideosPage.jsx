
import React, { useEffect, useState } from 'react'
import LongVideo from '../VideoType/LongVideo'
import { useParams } from 'react-router-dom'
import { userDashboard } from '../../../services/user.service';
const DashboardVideosPage = () => {
    const {username} = useParams();
    const [videoInfo, setVideoInfo] = useState([])
    useEffect(() => {
      const fetchData = async () => {
      let res = await userDashboard(username);
       if (res?.response?.data?.data === "Unauthorized request, Token created") {
                    const res2 = await generateNewAccessToken();
                    if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
                      alert("Your refresh Token expiry, please Login and useSpecific services");
                      dispatch(logout());
                      navigate("/login");
                      return;
                    }
                    if (res2?.data?.message === "Access Token is created SuccessFully") {
                      const res3 = await userDashboard(username);
                      res = res3;
      
                      return;
                    }
                  }
      if (!res) {
        console.log("No API Response Received");
        return;
      }
      if (res?.status == 200) {
        // setuserInfo(response.data.data)
        // console.log(response.data.data)
        let data = res?.data?.data?.vc;
        data = Array.isArray(data)?data:[];
        data = data.filter((video) => video?.category === "video");
        const sortedData = data.sort((a, b) => new Date(b?.createdAt)- new Date(a?.createdAt));
        setVideoInfo(sortedData);
      }

    }
    fetchData();
    }, [username]);
  return (
   <div className="flex flex-wrap gap-2 mt-4">

        {
            videoInfo.map((video) => (
                <div
                key={video._id}
                >
                    <LongVideo video ={video}/>
                </div>
            ))
        }
    </div>
  )
}

export default DashboardVideosPage
