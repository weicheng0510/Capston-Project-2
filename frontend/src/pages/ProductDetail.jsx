import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import Api from '../common/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import FullImage from '../components/FullImage';
import SimilarProduct from '../components/SimilarProduct';
import addToCart from '../helpers/addToCart';
import UserContext from '../contect/useContect';
import { toast } from 'react-toastify';

const ProductDetail = () => {
    const init = {
        title: "",
        brand: "",
        model: "",
        category: "",
        image: [],
        description: "",
        price: "",
        quantity: ""
    };
    const [data, setData] = useState(init);
    const { token, fetchCart } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const [fullImage, setFullImage] = useState("");
    const params = useParams();

    const fetchProductDetail = async () => {
        setLoading(true);
        const res = await fetch(Api.productDetail.url, {
            method: Api.productDetail.method,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                productId: params?.id
            })
        });
        const resData = await res.json();

        setData(resData?.data);
        setLoading(false);
    };

    // Function to update `isSmallScreen` based on window size
    const updateScreenSize = () => {
        setIsSmallScreen(window.innerWidth < 768);
    };

    const handleAddToCart = async (e, id, token) => {
        await addToCart(e, id, token);
        fetchCart();
    }

    useEffect(() => {
        setThumbsSwiper(null);
        fetchProductDetail();
        updateScreenSize(); // Check screen size on initial render
        window.addEventListener('resize', updateScreenSize); // Listen for window resize
        return () => {
            window.removeEventListener('resize', updateScreenSize); // Cleanup on unmount
        };
    }, [params.id]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }


    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row">
                {/* Image Display */}
                <div className="flex md:flex-row flex-col-reverse">
                    {/* Thumbnails */}
                    {data.image.length > 0 && (
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={4}
                            direction={isSmallScreen ? "horizontal" : "vertical"} // Set direction dynamically
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className={`mySwiper ${isSmallScreen ? "w-full h-36" : "w-24 h-[340px]"}`}
                        >
                            {data.image.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`${isSmallScreen ? "w-24 h-24 mt-3" : "w-22 h-full"} object-cover cursor-pointer border border-gray-300 rounded`}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}

                    {/* Main Image */}
                    <Swiper
                        style={{
                            '--swiper-navigation-color': '#000',
                            '--swiper-pagination-color': '#000',
                        }}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper2 w-[340px] h-[340px]"
                    >
                        {data.image.map((img, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={img}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-contain cursor-pointer"
                                    onClick={() => {
                                        setOpenImage(true)
                                        setFullImage(img)
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* display full screen image */}
                {
                    openImage && (
                        <FullImage imgUrl={fullImage} onClose={() => setOpenImage(false)} />
                    )
                }

                {/* Details Section */}
                <div className="flex-1 px-4">
                    <h1 className="text-2xl font-bold">{data.title}</h1>
                    <p className="text-lg">Brand: {data.brand}</p>
                    <p className="text-lg">Model: {data.model}</p>
                    <p className="text-lg">Category: {data.category}</p>
                    <p className="text-2xl font-semibold mt-4 text-green-600">${data.price}</p>
                    <p className="text-lg font-medium mt-2">Qty: {data.quantity}</p>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-4">
                        <Link
                            to={'/cart'}
                            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                            onClick={(e) => {
                                if (!token) {
                                    e.preventDefault();
                                    toast.error('Please log in to proceed');
                                    return;
                                }
                                handleAddToCart(e, data._id, token);
                                window.location.href = '/cart';
                            }}
                        >
                            Buy It Now
                        </Link>
                        <button className="bg-gray-200 px-4 py-2 rounded shadow" onClick={(e) => handleAddToCart(e, data._id, token)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
            <div className='mt-6'>
                <h4 className='text-2xl font-bold'>Item description: </h4>
                <p className="mt-4 text-gray-600">{data.description}</p>
            </div>
            <div>
                <SimilarProduct category={data.category} />
            </div>
        </div>
    );
};

export default ProductDetail;
