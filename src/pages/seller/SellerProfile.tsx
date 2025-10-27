import { logoutSellerSession } from '@/redux/features/seller/sellerAuthSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import type { RootState } from '@/redux/store/store';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function SellerProfile() {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<any>(null); // Store the full profile data
    const dispatch = useAppDispatch();


   const { pathname } = useLocation();

    const loginTimestamp = useAppSelector((state: RootState) => state.sellerAuth.loginTimestamp);
    
    useEffect(()=>{

        if(loginTimestamp != null){
           navigate('/seller/profile');
        }
        

    },[pathname])
    // useEffect(() => {

    // const fetchProfile = async (jwt_Token: any, seller_Id: any) => {
    //     try {

    //         const url = sellerId ? `http://localhost:6173/api/seller/getInfo?sellerId=${seller_Id}` : `http://localhost:6173/api/seller/getInfo`;

    //         const res = await fetch(url, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${jwt_Token}`,
    //             },
    //             credentials: "include",
    //         });

    //         if (res.status === 200) {
    //             data = await res.json();
    //              setProfileData(data); // Store the data in state
    //             console.log(data.fullName)
    //             setAuthorized(true);

    //         } else {
    //             setAuthorized(false);
    //         }
    //     } catch (err) {
    //         setAuthorized(false);
    //     }

    // };

    // if(!sellerId){
    //     const token = localStorage.getItem("jwt_token");
    //     const storedSellerId = localStorage.getItem("sellerId");

    //     if (!token && !storedSellerId) {
    //         setAuthorized(false);
    //         return;
    //     }
    //     fetchProfile(token,storedSellerId);
    // }else{
    //     const token = localStorage.getItem("jwt_token");

    //     fetchProfile(token,sellerId);
    // }     



    // }, []);

    // useEffect(() => {
    //     if (authorized === false) {
    //         navigate("/seller/login");
    //     }
    // }, [authorized]);

    // const logout = () => {
    //     localStorage.removeItem("jwt_token");
    //     localStorage.removeItem("sellerId");
    //     navigate("/seller/login");
    // };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const url = sellerId
                    ? `http://localhost:6173/api/seller/getInfo?sellerId=${sellerId}`
                    : `http://localhost:6173/api/seller/getInfo`;

                const res = await fetch(url, {
                    credentials: "include", // Cookies भेजें
                });

                if (res.status === 401) {
                    navigate('/seller/login');
                    return;
                }

                const data = await res.json();
                setProfileData(data);
            } catch (err) {
                navigate("/seller/login"); // Error होने पर login पर redirect
            }
        };

        fetchProfile();
    }, [sellerId, navigate]);


    const logout = async () => {
        try {
            dispatch(logoutSellerSession()).then(() => {
                navigate("/seller/login");
            });


        } catch (error) {

            navigate("/seller/login");
        }
    };

    return (
        <div>
            <h2 className='mt-44'>Seller Profile! Hey {profileData?.fullName}</h2>
            <button onClick={logout}>LogOut</button>
        </div>
    );
}

export default SellerProfile;