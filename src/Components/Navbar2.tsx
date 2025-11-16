import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar2() {

    const Categories = [
        {
            key: [{ key: "men-topwear", label: "Men's Top Wear" },
            { key: "men-bottomwear", label: "Men's Bottom Wear" },
            { key: "men-footwear", label: "Men Footwear" }],
            label: "Men's"
        },

        {
            key: [{ key: "women-ethnic", label: "Women Ethnic" },
            { key: "women-western", label: "Women Western" },
            { key: "women-footwear", label: "Women Footwear" }],
            label: "Women's"
        },
        {
            key: [{ key: "boys-brands", label: "Boys Brands" },
            { key: "girls-grands", label: "Girs Grands" }],
            label: "Kid's"
        },
        {
            key: [{ key: "mens-wa", label: "Men's" },
            { key: "womens-wa", label: "Women's" },
            { key: "boys-wa", label: "Boy's" },
            { key: "girls-wa", label: "Girl's" }],
            label: "Watches And Accessories"
        },
        {
            key: [{ key: "bags", label: "Bags" },
            { key: "suitcases", label: "Suitcase" },
            { key: "luggage", label: "Luggage" }],
            label: "Bags, Suits And Lugage"
        }

    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);


  return (
    <div>
       <div className="customer-main-navbar bg-white">

            <div className="customer-top-navbar">
                <div className="logo">
                   <NavLink to="/">Trendora</NavLink>
                </div>
                <div className="search-bar">
                    Search Bar
                </div>
                <div className="become-seller">
                    <NavLink to="/seller" className="hover-underline-with-scroll">Become A Seller</NavLink>
                </div>
                <div className="login-signup">
                    <NavLink to="/login" className="login-btn-with-scroll">Login</NavLink>
                    <NavLink to="/signup" className="signup-btn-with-scroll">Signup</NavLink>
                </div>
            </div>
            <div className="customer-bottom-navbar border-black">
                <ul className="nav-links">

                    {
                        Categories.map((cItem, cIndex) => (
                            <li
                                key={cIndex}
                                className="relative p-4"
                                onMouseEnter={() => setOpenIndex(cIndex)}
                                onMouseLeave={() => setOpenIndex(null)}
                            >
                                <div className="dropdown-pointer-parentdiv">
                                    {cItem.label} <span className={`dropdown-pointer ${openIndex === cIndex ? "rotate-180" : "rotate-0"}`}>▼</span>
                                </div>

                                <ul
                                    className={`dropdown-ul ${openIndex === cIndex ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                                >
                                    {cItem.key.map((item, index) => (
                                        <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <NavLink to={`/${item.key}`}>{item.label}</NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                        ))
                    }



                </ul>
            </div>

        </div>
    </div>
  )
}

export default Navbar2
