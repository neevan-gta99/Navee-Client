import { Outlet } from "react-router-dom"
import SellerNavbar from "../SellerNavbar";
import SellerFooter from "../SellerFooter";
import { useSessionExpiryGuard } from '@/customHooks/auths/useSessionExpiryGuard'
import { skipGuardRoutes } from '@/utils/seller/skipSellerRoutes'
import ScrollToTop from "../ScrollToTop";

const SellerLayout = () => {


    useSessionExpiryGuard(skipGuardRoutes);


    return (<>
        <ScrollToTop/>
        <SellerNavbar />
        <main className="min-h-screen">
            <Outlet />
        </main>
        <SellerFooter />


    </>)


}

export default SellerLayout;