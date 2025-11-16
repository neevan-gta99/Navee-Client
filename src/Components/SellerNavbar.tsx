import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { RootState } from '@/redux/store/store';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutSellerSession } from '@/redux/features/seller/sellerAuthSlice';


function SellerNavbar() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();



    const isOnProfilePage = location.pathname === "/seller/profile";
    const isOnLoginPage = location.pathname === "/seller/login";
    const isOnRegisterPage = location.pathname === "/seller/register";

    const loginTimestamp = useAppSelector((state: RootState) => state.sellerAuth.loginTimestamp);

    useEffect(() => {

        if (loginTimestamp != null) {
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false)
        }

    }, [pathname])

    const handleLogout = async () => {
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
            <div className="seller-main-navbar bg-white">
                <div className="logo">
                    <NavLink to="/">Trendora</NavLink>
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
                        isOnProfilePage ? (
                            <button
                                className="signup-btn-with-scroll"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <NavLink
                                to="/seller/profile"
                                className="signup-btn-with-scroll"
                            >
                                Profile
                            </NavLink>
                        )
                    ) : (
                        <>
                            {isOnLoginPage ? (
                                <NavLink
                                    to="/seller/register"
                                    className="signup-btn-with-scroll"
                                >
                                    Register
                                </NavLink>
                            ) : isOnRegisterPage ? (
                                <NavLink
                                    to="/seller/login"
                                    className="signup-btn-with-scroll"
                                >
                                    Login
                                </NavLink>
                            ) : (
                                <>
                                    <NavLink
                                        to="/seller/register"
                                        className="signup-btn-with-scroll"
                                    >
                                        Register
                                    </NavLink>
                                    <NavLink
                                        to="/seller/login"
                                        className="signup-btn-with-scroll"
                                    >
                                        Login
                                    </NavLink>
                                </>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default SellerNavbar;