import { Outlet } from "react-router-dom"
import SellerNavbar from "../SellerNavbar";
import SellerFooter from "../SellerFooter";
import Expiry_Guards from "@/customHooks/auths/useSessionExpiryGuard";
import { skipSellerGuardRoutes } from '@/utils/skipRoutes/skipSellerRoutes'
import ScrollToTop from "../ScrollToTop";

const SellerLayout = () => {


    Expiry_Guards.useSellerSessionExpiryGuard(skipSellerGuardRoutes);
    


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