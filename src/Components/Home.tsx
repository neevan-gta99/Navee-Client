import MensWear from "./Mens/MensWear";

const Home = () => {


    return (
        <>
            <section className="relative w-full h-screen overflow-hidden">
                <video
                    className="fashion-video absolute top-0 left-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/videos/fashionVideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* 🔥 Black Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 z-10"></div>

                {/* Overlay Content */}
                <div className="relative z-20 text-white text-center pt-32">
                    <h1 className="text-4xl font-bold">Welcome to Fashion World</h1>
                    <p className="text-lg">Explore the latest trends</p>
                </div>
            </section>


            {/* Content Below Video */}
            <section className="flex justify-center items-center">
                <div className="offer-strip">
                    <h2>7 Days Easy Return</h2>
                    <h2>Cash On Delivery</h2>
                    <h2>Lowest Prices</h2>
                    <h2>Best Quality</h2>
                </div>
            </section>

            {/* Mens */}

           <MensWear/>

            {/* Womens */}

            <section className="flex justify-center items-center flex-col mt-16 w-screen bg-white">
                <div className="women-heading">
                    <h1>Women's Wear</h1>
                </div>
                <div className="women-wear">
                    <div className="women-offer">
                        <img src="/mensImgs/t-shirt.webp" alt="" className="women-imgs"/>
                        <h4>T-shirt</h4>
                        <h3>40% Off</h3>
                    </div>
                    <div className="women-offer">
                        <img src="/mensImgs/t-shirt.webp" alt="" className="women-imgs"/>
                        <h4>T-shirt</h4>
                        <h3>40% Off</h3>
                    </div>
                    <div className="women-offer">
                        <img src="/mensImgs/t-shirt.webp" alt="" className="women-imgs"/>
                        <h4>T-shirt</h4>
                        <h3>40% Off</h3>
                    </div>
                    <div className="women-offer">
                        <img src="/mensImgs/t-shirt.webp" alt="" className="women-imgs"/>
                        <h4>T-shirt</h4>
                        <h3>40% Off</h3>
                    </div>
                    <div className="women-offer">
                        <img src="/mensImgs/t-shirt.webp" alt="" className="women-imgs"/>
                        <h4>T-shirt</h4>
                        <h3>40% Off</h3>
                    </div>
                    <div className="women-offer">
                        <img src="/mensImgs/t-shirt.webp" alt="" className="women-imgs"/>
                        <h4>T-shirt</h4>
                        <h3>40% Off</h3>
                    </div>
                </div>
            </section>

            {/* Offers carousel */}

            <section>

            </section>

            {/* Kids */}
            <section className="mt-16">
                <div className="flex justify-center">
                    <div className="boys-girls">
                        <div className="text-center">
                            <h1>Boys's Brands</h1>
                        </div>

                        <div className="brands-grands">
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                        </div>


                    </div>
                    <div className="boys-girls">
                        <div className="text-center">
                            <h1>Boys's Brands</h1>
                        </div>

                        <div className="brands-grands">
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="brands-grands-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" className="brands-grands-imgs" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                        </div>


                    </div>
                </div>
            </section>

            {/* carousel W & A*/}

            <section>

            </section>


            {/* Bags... */}

            <section  className="mt-16">
                <div className="flex justify-center">
                    <div className="bags-suitcases-luggage">
                        <div className="text-center">
                            <h1>Bags</h1>
                        </div>

                        <div className="bags">
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                        </div>


                    </div>
                    <div className="bags-suitcases-luggage">
                        <div className="text-center">
                            <h1>Suitcases</h1>
                        </div>

                        <div  className="suitcases">
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                        </div>


                    </div>
                     <div className="bags-suitcases-luggage">
                        <div className="text-center">
                            <h1>Luggage</h1>
                        </div>

                        <div className="luggage">
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                            <div className="bags-suitcases-luggage-offer">
                                <img src="/mensImgs/t-shirt.webp" alt="" />
                                <h4>T-shirt</h4>
                                <h3>40% Off</h3>
                            </div>
                        </div>


                    </div>
                </div>
            </section>


        </>
    );
};

export default Home;
