import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { generateNewAccessToken, Userprofile as serviceUserprofile } from '../../services/user.service';
import { useState } from 'react';

function Userprofile() {
    const authStatus = useSelector((state) => state.auth.status);
    const [profileUrl, setprofileUrl] = useState(null);
    useEffect( () => {
        const fetchProfile = async () => {
             if (authStatus) {
                 const res = await serviceUserprofile();
                //  console.log(res?.response?.data);
                //  if (res?.response?.data?.data === "Unauthorized request, Token created") {
                //     console.log("hai")
                //    const res2 =  await generateNewAccessToken();

                //    if (res2?.response?.data?.statusCode === 201) {
                //     const res3 = await serviceUserprofile();
                //     setprofileUrl(res3?.data?.data?.userImage);
                //    }
                //  }
                 const userImageUrl = res?.data?.data?.userImage;//First data userServicesProvide 
                 setprofileUrl(userImageUrl);

        }
        }
        fetchProfile();
       
    },[authStatus])
    return (
        <div>
            <Link to="/">
                <img src={`${profileUrl}`} className='w-8 h-8 rounded-full'/>
            </Link>
        </div>
    );
}

export default Userprofile;
