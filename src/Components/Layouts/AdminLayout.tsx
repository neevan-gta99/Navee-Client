import { Outlet } from "react-router-dom"
import Expiry_Guards from "@/customHooks/auths/useSessionExpiryGuard";
import ScrollToTop from "../ScrollToTop";
import AdminNavbar from "@/pages/admin/AdminNavbar";
import { skipAdminGuardRoutes } from "@/utils/skipRoutes/skipadminRoutes";

const AdminLayout = () => {

    Expiry_Guards.useAdminSessionExpiryGuard(skipAdminGuardRoutes)

    return (<>
        <ScrollToTop/>
        <AdminNavbar />
        <main className="min-h-screen">
            <Outlet />
        </main>
        {/* <SellerFooter /> */}


    </>)


}

export default AdminLayout;