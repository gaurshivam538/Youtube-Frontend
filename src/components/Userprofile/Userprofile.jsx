import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { generateNewAccessToken, Userprofile as serviceUserprofile } from '../../services/user.service';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth.slice';

function Userprofile() {
    const authStatus = useSelector((state) => state.auth.status);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [profileUrl, setprofileUrl] = useState(null);
    useEffect( () => {
        const fetchProfile = async () => {
             if (authStatus) {
                 const res = await serviceUserprofile();
                 console.log(res?.response?.data);
              if (res?.response?.data?.data === "Unauthorized request, Token created") {
                const res2 = await generateNewAccessTokeneNewAccessToken();
                if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
                  alert("Your refresh Token expiry, please Login and useSpecific services");
                  dispatch(logout());
                  navigate("/login");
                  return;
                }
                if (res2?.data?.message === "Access Token is created SuccessFully") {
                  const res3 = await serviceUserprofile();
                  setprofileUrl(res3?.data?.data?.userImage);
                  return;
                }
              }
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
