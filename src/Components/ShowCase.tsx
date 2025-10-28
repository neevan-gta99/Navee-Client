import { BASE_URL } from '@/config/apiConfig';
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';

type Product = {
    name: string;
    subCategory: string;
    discount: number;
    finalPrice: number;
    images?: {
        optimizeUrl: string;
    }[];
};

function ShowCase() {

    const [data, setData] = useState<Product[]>([]);

    const [searchParams] = useSearchParams();
    const sub_Category = searchParams.get('subCategory');

    const [offset, setOffset] = useState(0);


    const fetchShowcaseLazyLoad = async () => {
        try {
            const showcaseURL = `${BASE_URL}/api/getProduct/showcase-lazy-load?subCategory=${encodeURIComponent(sub_Category || '')}&offset=${offset}`;
            const response = await fetch(showcaseURL);
            const json = await response.json();

            if (response.ok) {
                setData(prev => [...prev, ...json.productInfo]); // append new products
            }
        } catch (error) {
            console.error("Error fetching showcase products:", error);
        }
    };

    useEffect(() => {
        if (sub_Category !== null) {
            fetchShowcaseLazyLoad();
        }
    }, [sub_Category, offset]);



    return (

        <section className='p-2'>

            <div className='flex justify-center items-center border-black w-screen border p-4 showcase-section'>

                <div className='showcase-section-filter'>

                </div>

                <div className='showcase-section-products'>



                </div>
            </div>

        </section>

    )
}

export default ShowCase;
