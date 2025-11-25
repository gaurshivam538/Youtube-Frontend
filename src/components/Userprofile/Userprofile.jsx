import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Userprofile as serviceUserprofile } from '../../services/user.service';
import { useState } from 'react';

function Userprofile() {
    const authStatus = useSelector((state) => state.auth.status)
    const [profileUrl, setprofileUrl] = useState(null);
    useEffect( ()=>{
        const fetchProfile = async () => {
             if (authStatus) {
                 const response = await serviceUserprofile();
                 const url = response.data.data;
                 setprofileUrl(url);

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
