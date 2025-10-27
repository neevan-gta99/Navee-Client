import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Product = {
  name: string;
  subCategory: string;
  discount: number;
  finalPrice: number;
  images?: {
    optimizeUrl: string;
  }[];
};

function MensWear() {
  const [data, setData] = useState<Product[]>([]);
  const [subCategoryOfMenWear, setSubCategoryOfMenWear] = useState<null | string>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchMensTopwear = async () => {
      try {
        const getMensTopwearURL = "http://localhost:6173/api/getProduct/get-showcase-men-topwears";
        const response = await fetch(getMensTopwearURL);
        const receivedData = await response.json();
        setData(receivedData.productInfo);

        receivedData.productInfo.forEach((item: Product, index: number) => {
          console.log(`Image URL [${index}]:`, item.images?.[0]?.optimizeUrl);
        });

      } catch (error) {
        console.error("Error fetching men's topwear:", error);
      }
    };

    fetchMensTopwear();
  }, []);


  useEffect(() => {
    if (subCategoryOfMenWear) {
      navigate(`/showcase?subCategory=${encodeURIComponent(subCategoryOfMenWear)}`);
    }
  }, [subCategoryOfMenWear]);


  return (
    <section className="flex flex-col items-center mt-16 bg-white">
      <div className="section-heading">
        <h1>Men's Wear</h1>
      </div>

      <div className="section-wear">
        {data.map((item, index) => (
          <div key={index} className="section-offer" onClick={() => setSubCategoryOfMenWear(item.subCategory)}>
            <img
              src={item.images?.[0]?.optimizeUrl}
              alt={item.name}
              className="section-imgs"
            />
            <h4 className="section-item-name">{item.name}</h4>
            <p className="section-item-subcategory">{item.subCategory}</p>
            <p className="section-item-discount">{item.discount}% Off</p>
            <p className="section-item-finalprice">₹{item.finalPrice}</p>
          </div>
        ))}
      </div>
    </section>
  );


}

export default MensWear;
