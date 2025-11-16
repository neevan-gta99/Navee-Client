import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store/store';
import { logoutSellerSession } from '@/redux/features/seller/sellerAuthSlice';
import { logoutAdminSession } from '@/redux/features/admin/adminAuthSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutSeller } from '@/redux/features/seller/sellerAuthSlice';
import { useAppDispatch } from '@/redux/hooks';

const useSellerSessionExpiryGuard = (skipRoutes: string[]) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const loginTimestamp = useSelector((state: RootState) => state.sellerAuth.loginTimestamp);

    useEffect(() => {
        const shouldSkip = skipRoutes.some(route => pathname.startsWith(route));
        const now = Date.now();
        const sessionDuration = 60 * 60 * 1000;

        if (!shouldSkip) {
            if (!loginTimestamp) {
                navigate("/seller/login");
                return;
            }
            console.log("Register");



            if (now - loginTimestamp > sessionDuration) {
                dispatch(logoutSellerSession()).then(() => {
                    navigate("/seller/login");
                });
            }
        }
        else {
            if (loginTimestamp != null && now - loginTimestamp > sessionDuration) {
                dispatch(logoutSellerSession());
            }
        }
    }, [pathname]);

};

const useAdminSessionExpiryGuard = (skipRoutes: string[]) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const loginTimestamp = useSelector((state: RootState) => state.adminAuth.loginTimestamp);

    useEffect(() => {
        const shouldSkip = skipRoutes.some(route => pathname.startsWith(route));
        const now = Date.now();
        const sessionDuration = 60 * 60 * 1000;

        if (!shouldSkip) {
            if (!loginTimestamp) {
                navigate("/admin/login");
                return;
            }
            console.log("Register");



            if (now - loginTimestamp > sessionDuration) {
                dispatch(logoutAdminSession()).then(() => {
                    navigate("/admin/login");
                });
            }
        }
        else {
            if (loginTimestamp != null && now - loginTimestamp > sessionDuration) {
                dispatch(logoutAdminSession());
            }
        }
    }, [pathname]);

};

const Expiry_Guards = {useSellerSessionExpiryGuard, useAdminSessionExpiryGuard};
export default Expiry_Guards;
