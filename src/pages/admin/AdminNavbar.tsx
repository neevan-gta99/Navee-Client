import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { RootState } from '@/redux/store/store';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutAdminSession } from '@/redux/features/admin/adminAuthSlice';

function AdminNavbar() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();


    const loginTimestamp = useAppSelector((state: RootState) => state.adminAuth.loginTimestamp);

    useEffect(() => {

        if (loginTimestamp != null) {
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false)
        }

    }, [pathname])


    const logout = async () => {
            try {
                dispatch(logoutAdminSession()).then(() => {
                    navigate("/admin/login");
                });
    
    
            } catch (error) {
    
                navigate("/admin/login");
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
                            <NavLink to="/admin/db-migration" className="hover-underline-with-scroll">Migrate DB</NavLink>
                        </li>


                        <li>
                            <NavLink to="/admin/seller-monitor" className="hover-underline-with-scroll">Sellers Monitor</NavLink>
                        </li>

                        <li>
                            <NavLink to="/admin/seller-management" className="hover-underline-with-scroll">Sellers Management</NavLink>
                        </li>

                        <li>
                            <NavLink to="/admin/seller-approval" className="hover-underline-with-scroll">Seller Approval</NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/support" className="hover-underline-with-scroll">Support</NavLink>
                        </li>
                    </ul>
                </div>

                <div className="login-signup">

                    {isLoggedIn && (
                       <button className="signup-btn-with-scroll" onClick={logout}>Logout</button>
                    )}

                </div>
            </div>
        </div>
    );
}

export default AdminNavbar;