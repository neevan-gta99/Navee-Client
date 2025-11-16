import { BASE_URL } from '@/config/apiConfig';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import type { RootState } from '@/redux/store/store';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function AdminDashboard() {

  const { adminId } = useParams();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<any>(null); // Store the full profile data
    const dispatch = useAppDispatch();


   const { pathname } = useLocation();

    const loginTimestamp = useAppSelector((state: RootState) => state.adminAuth.loginTimestamp);
    
    
    
    useEffect(()=>{
      
      console.log("TimeStamp ",loginTimestamp);
        if(loginTimestamp != null){
           navigate('/admin/dashboard');
        }
        

    },[pathname])



        useEffect(() => {
            const fetchProfile = async () => {
                try {
                    const url = adminId
                        ? `${BASE_URL}/api/admin/getInfo?adminId=${adminId}`
                        : `${BASE_URL}/api/admin/getInfo`;
    
                    const res = await fetch(url, {
                        credentials: "include", // Cookies भेजें
                    });
    
                    if (res.status === 401) {
                        navigate('/admin/login');
                        return;
                    }
    
                    const data = await res.json();
                    setProfileData(data);
                } catch (err) {
                    navigate("/admin/login"); // Error होने पर login पर redirect
                }
            };
    
            fetchProfile();
        }, [adminId, navigate]);


  return (
     <div>
            <h2 className='mt-44'>Admin Dashboard! Hey {profileData?.fullName}</h2>
            
        </div>
  )
}

export default AdminDashboard
