import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Api from '../common/api';
import '../style/categoryList.css'
import { Link } from 'react-router';

const CategoryList = () => {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const res = await fetch(Api.categoryProduct.url);
            const resData = await res.json();
            setCategory(resData.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-neutral-100">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                navigation={true}
                pagination={{ clickable: true }}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                {category.map((p, i) => (
                    <SwiperSlide key={i}>
                        <div className='p-8 backgroundImage'>
                            <Link to={`/category/${p.category}`} className='flex justify-center gap-10'>
                                {/* Render only 1 image or 3 images based on screen size */}
                                {isLargeScreen
                                    ? p.image.slice(0, 3).map((image, j) => (
                                        <img
                                            key={j}
                                            src={image}
                                            alt={`Category ${j}`}
                                            className="h-60 object-fill"
                                        />
                                    ))
                                    : p.image.slice(0, 1).map((image, j) => (
                                        <img
                                            key={j}
                                            src={image}
                                            alt={`Category ${j}`}
                                            className="h-60 object-fill"
                                        />
                                    ))}
                            </Link>
                            <p className="text-center font-bold mt-2 text-white text-xl">{p?.category}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div >
    );
};

export default CategoryList;
