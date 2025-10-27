import { Outlet, useLocation } from "react-router-dom"
import Footer from "../Footer"
import Navbar from "../Navbar"
import Navbar2 from "../Navbar2";
import ScrollToTop from "../ScrollToTop";

const CustomerLayout = ()=>{

     const location = useLocation();
  const isHomePage = location.pathname === "/";
    
    return(<>

        <ScrollToTop/>
        {isHomePage ? <Navbar /> : <Navbar2 />}
        <main className={`min-h-screen ${isHomePage ? "" : "pt-36"}`}>
            <Outlet/>
        </main>
        <Footer/>
    
    
    </>)


}

export default CustomerLayout;