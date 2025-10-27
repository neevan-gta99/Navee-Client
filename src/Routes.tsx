import { Routes, Route } from "react-router-dom"
import CustomerLayout from "./Components/Layouts/CustomerLayout"
import Home from "./Components/Home"

import LogIn from "./pages/customer/LogIn"
import SignUp from "./pages/customer/SignUp"
import MenTopwear from "./pages/customer/Men's/MenTopwear"
import MenBottomwear from "./pages/customer/Men's/MenBottomwear"
import MenFootwear from "./pages/customer/Men's/MenFootwear"
import WomenEthnic from "./pages/customer/Women's/WomenEthnic"
import WomenWestern from "./pages/customer/Women's/WomenWestern"
import WomenFootwear from "./pages/customer/Women's/WomenFootwear"
import BoysBrands from "./pages/customer/Kid's/BoysBrands"
import GirlsGrands from "./pages/customer/Kid's/GirlsGrands"
import BoysWA from "./pages/customer/WatchesAndAccessories/BoysWA"
import GirlsWA from "./pages/customer/WatchesAndAccessories/GirlsWA"
import MensWA from "./pages/customer/WatchesAndAccessories/MensWA"
import WomensWA from "./pages/customer/WatchesAndAccessories/WomensWA"
import Bags from "./pages/customer/BagsSuitcasesAndLuggage/Bags"
import Suitcases from "./pages/customer/BagsSuitcasesAndLuggage/Suitcases"
import Luggage from "./pages/customer/BagsSuitcasesAndLuggage/Luggage"
import SellerLayout from "./Components/Layouts/SellerLayout"
import SellerDashboard from "./pages/seller/SellerDashboard"
import SellerRegister from "./pages/seller/SellerRegister"
import AddProduct from "./pages/seller/AddProduct"
import Analytics from "./pages/seller/Analytics"
import HowItWorks from "./pages/seller/HowItWorks"
import AdminSupport from "./pages/seller/AdminSupport"
import PriceAndCommission from "./pages/seller/PriceAndCommission"
import SellerLogin from "./pages/seller/SellerLogin"
import SellerProfile from "./pages/seller/SellerProfile"
import AddMenTopwear from "./Components/AddMenTopwear"
import AddMenBottomwear from "./Components/AddMenBottomwear"
import AddMenFootwear from "./Components/AddMenFootwear"
import AddWomenEthnic from "./Components/AddWomenEthnic"
import AddWomenWestern from "./Components/AddWomenWestern"
import AddWomenFootwear from "./Components/AddWomenFootwear"
import AddBoysBrands from "./Components/AddBoysBrands"
import AddGirlsGrands from "./Components/AddGirlsGrands"
import AddMensWA from "./Components/AddMensWA"
import AddWomensWA from "./Components/AddWomensWA"
import AddBoysWA from "./Components/AddBoysWA"
import AddGirlsWA from "./Components/AddGirlsWA"
import AddBags from "./Components/AddBags"
import AddSuitcases from "./Components/AddSuitcases"
import AddLuggage from "./Components/AddLuggage"
import ProtectedSellerRoute from "./Components/ProtectedSellerRoute"
import ShowCase from "./Components/ShowCase"
import AddInBulk from "./Components/AddInBulk"

const AppRoutes = () => {

    return (<>

        <Routes>
            {/* Customer Layout */}
            <Route path="/" element={<CustomerLayout />}>
                <Route index element={<Home />} />
                <Route path="men-topwear" element={<MenTopwear />} />
                <Route path="men-bottomwear" element={<MenBottomwear />} />
                <Route path="men-footwear" element={<MenFootwear />} />
                <Route path="women-ethnic" element={<WomenEthnic />} />
                <Route path="women-western" element={<WomenWestern />} />
                <Route path="women-footwear" element={<WomenFootwear />} />
                <Route path="boys-brands" element={<BoysBrands />} />
                <Route path="girls-grands" element={<GirlsGrands />} />
                <Route path="boys-wa" element={<BoysWA />} />
                <Route path="girls-wa" element={<GirlsWA />} />
                <Route path="mens-wa" element={<MensWA />} />
                <Route path="womens-wa" element={<WomensWA />} />
                <Route path="bags" element={<Bags />} />
                <Route path="suitcases" element={<Suitcases />} />
                <Route path="luggage" element={<Luggage />} />
                <Route path="showcase" element={<ShowCase />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Seller Layout */}
            <Route path="/seller" element={<SellerLayout />}>
                <Route index element={<SellerDashboard />} />
                <Route path="profile" element={<SellerProfile />} />
                <Route path="profile/:sellerId" element={<SellerProfile />} />

                <Route
                    path="add-product"
                    element={

                        <AddProduct />

                    }
                >
                    <Route path="men-topwear/single" element={<AddMenTopwear />} />
                    <Route path="men-bottomwear/single" element={<AddMenBottomwear />} />
                    <Route path="men-footwear/single" element={<AddMenFootwear />} />
                    <Route path="women-ethnic/single" element={<AddWomenEthnic />} />
                    <Route path="women-western/single" element={<AddWomenWestern />} />
                    <Route path="women-footwear/single" element={<AddWomenFootwear />} />
                    <Route path="boys-brands/single" element={<AddBoysBrands />} />
                    <Route path="girls-grands/single" element={<AddGirlsGrands />} />
                    <Route path="mens-wa/single" element={<AddMensWA />} />
                    <Route path="womens-wa/single" element={<AddWomensWA />} />
                    <Route path="boys-wa/single" element={<AddBoysWA />} />
                    <Route path="girls-wa/single" element={<AddGirlsWA />} />
                    <Route path="bags/single" element={<AddBags />} />
                    <Route path="suitcases/single" element={<AddSuitcases />} />
                    <Route path="luggage/single" element={<AddLuggage />} />
                    <Route path="bulk" element={<AddInBulk />} />
                </Route>

                <Route path="analytics" element={<Analytics />} />
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="price-and-commission" element={<PriceAndCommission />} />
                <Route path="admin-support" element={<AdminSupport />} />
                <Route path="register" element={<SellerRegister />} />
                <Route path="login" element={<SellerLogin />} />
            </Route>

        </Routes>

    </>)


}

export default AppRoutes;