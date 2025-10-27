import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { RootState } from '@/redux/store/store';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';


function SellerNavbar() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { pathname } = useLocation();

    const loginTimestamp = useAppSelector((state: RootState) => state.sellerAuth.loginTimestamp);
    
    useEffect(()=>{

        if(loginTimestamp != null){
            setIsLoggedIn(true);
        }
        else{
            setIsLoggedIn(false)
        }

    },[pathname])
    

    return (
        <div>
            <div className="seller-main-navbar bg-white">
                <div className="logo">
                    <NavLink to="/">Navee</NavLink>
                </div>
                <div className="">
                    <ul className='flex justify-around items-center text-black m-4'>
                        <li>
                            <NavLink to="/seller/analytics" className="hover-underline-with-scroll">Analytics</NavLink>
                        </li>
                        <li>
                            <NavLink to="/seller/how-it-works" className="hover-underline-with-scroll">How It Works</NavLink>
                        </li>
                        {/* Only show Add Product link if logged in */}
                        {isLoggedIn && (
                            <li>
                                <NavLink to="/seller/add-product" className="hover-underline-with-scroll">Add Product</NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink to="/seller/price-and-commission" className="hover-underline-with-scroll">Price And Commission</NavLink>
                        </li>
                        <li>
                            <NavLink to="/seller/admin-support" className="hover-underline-with-scroll">Support</NavLink>
                        </li>
                    </ul>
                </div>

                <div className="login-signup">
                    {isLoggedIn ? (
                        <NavLink to="/seller/profile" className="signup-btn-with-scroll">Profile</NavLink>
                    ) : (
                        <>
                            <NavLink to="/seller/register" className="signup-btn-with-scroll">Register</NavLink>
                            <NavLink to="/seller/login" className="signup-btn-with-scroll">Login</NavLink>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SellerNavbar;