import React, { useEffect, useState } from 'react';
import { BASE_URL } from "@/config/apiConfig.ts";
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { RootState } from '@/redux/store/store';
import { useAppSelector } from '@/redux/hooks';

function AddProduct() {

  const productCategories = [
    "Men Topwear",
    "Men Bottomwear",
    "Men Footwear",
    "Women Ethnic",
    "Women Western",
    "Women Footwear",
    "Boys Brands",
    "Girls Grands",
    "Mens Watches and Accessories",
    "Womens Watches and Accessories",
    "Boys Watches and Accessories",
    "Girls Watches and Accessories",
    "Bags",
    "Suitcases",
    "Luggage",
  ];

  const productCategoryMap = [
    { label: "Men Topwear", slug: "men-topwear" },
    { label: "Men Bottomwear", slug: "men-bottomwear" },
    { label: "Men Footwear", slug: "men-footwear" },
    { label: "Women Ethnic", slug: "women-ethnic" },
    { label: "Women Western", slug: "women-western" },
    { label: "Women Footwear", slug: "women-footwear" },
    { label: "Boys Brands", slug: "boys-brands" },
    { label: "Girls Grands", slug: "girls-grands" },
    { label: "Mens Watches and Accessories", slug: "mens-wa" },
    { label: "Womens Watches and Accessories", slug: "womens-wa" },
    { label: "Boys Watches and Accessories", slug: "boys-wa" },
    { label: "Girls Watches and Accessories", slug: "girls-wa" },
    { label: "Bags", slug: "bags" },
    { label: "Suitcases", slug: "suitcases" },
    { label: "Luggage", slug: "luggage" },
  ];

  const location = useLocation();
  const isRoot = location.pathname === "/seller/add-product";

  const [selectedCategory, setSelectedCategory] = useState<null | string>(null);
  const [singleOrBulk, setSingleOrBulk] = useState<null | string>(null);
  const navigate = useNavigate();

  const sellerId = useAppSelector((state: RootState) => state.sellerAuth.sellerData?.sellerId);
  console.log(sellerId);

  useEffect(() => {
  if (selectedCategory && singleOrBulk) {
    const slug = productCategoryMap.find(c => c.label === selectedCategory)?.slug;

    const queryParams = new URLSearchParams({
      seller_Id: sellerId,
      category: selectedCategory,
    });

    if (singleOrBulk === "Single") {
      navigate(`/seller/add-product/${slug}/single?${queryParams.toString()}`);
    } else {
      navigate(`/seller/add-product/bulk?${queryParams.toString()}`);
    }
  }
}, [selectedCategory, singleOrBulk]);


  const handleCategorySelect = (category: string) => {
    // If clicking the same category again, deselect it
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      setSingleOrBulk(null); // Reset single/bulk selection when changing category
    }
  };

  const handleSingleOrBulkSelect = (type: string) => {
    setSingleOrBulk(type);
  };

  return (
    <div>
      {isRoot && (
        <>
          <h1 className='mt-20'>Add Product</h1>
          <br />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {productCategories.map((category) => (
              <div key={category} className="border rounded p-4 bg-gray-50">
                <button
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full px-4 py-2 rounded ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>

                {/* Sub-options */}
                {selectedCategory === category && (
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleSingleOrBulkSelect("Single")}
                      className="px-3 py-1 bg-green-100 hover:bg-green-200 rounded"
                    >
                      ➕ Add Single Product
                    </button>
                    <button
                      onClick={() => handleSingleOrBulkSelect("Bulk")}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded"
                    >
                      📦 Add Multiple Products
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <Outlet />
    </div>
  );
}

export default AddProduct;