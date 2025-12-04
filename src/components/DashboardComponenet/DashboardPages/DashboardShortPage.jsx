
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userDashboard } from '../../../services/user.service';
import ShortVideo from '../VideoType/ShortVideo';
const DashboardShortPage = () => {
    const {username} = useParams();
    const [videoInfo, setVideoInfo] = useState([])
    useEffect(() => {
      const fetchData = async () => {
      const response = await userDashboard(username);
      if (!response) {
        console.log("No API Response Received");
        return;
      }
      if (response.status == 200) {
        // setuserInfo(response.data.data)
        // console.log(response.data.data)
        let data = response.data.data.vc;
        data = Array.isArray(data)?data:[];
        data = data.filter((video) => video.category === "short");
        const sortedData = data.sort((a, b) => new Date(b.createdAt)- new Date(a.createdAt));
        setVideoInfo(sortedData);
      }

    }
    fetchData();
    }, [username]);
  return (
   <div className="flex flex-wrap gap-2 mt-4 ">

        {
            videoInfo.map((video) => (
                <div
                key={video._id}
                >
                    <ShortVideo video ={video}/>
                </div>
            ))
        }
    </div>
  )
}

export default DashboardShortPage;
