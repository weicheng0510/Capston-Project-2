import React, { useEffect, useState } from 'react'
import Api from '../common/api';
import { Link } from 'react-router';

const BrandList = () => {
    const [brand, setBrand] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fetchBrand = async () => {
        setLoading(true);
        try {
            const res = await fetch(Api.brands.url);
            const resData = await res.json();
            setBrand(resData.data);
        } catch (error) {
            // console.error('Error fetching categories:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrand();
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) return <p className="text-center">Error loading brands</p>;

    return (
        <div className='container mt-6 mx-auto p-4 pt-2 flex justify-around text-xl font-bold bg-neutral-100 flex-wrap'>
            {
                brand.map((b, i) => (
                    <div key={i} className='mt-6 mx-2'>
                        <Link to={`/brand/${b}`} className="relative flex h-[50px] w-40 items-center rounded-lg justify-center overflow-hidden bg-gray-600 font-medium text-white shadow-2xl transition-all duration-300 before:absolute before:inset-0 before:border-0 before:border-white before:duration-100 before:ease-linear hover:bg-white hover:text-black hover:shadow-gray-700 hover:before:border-[25px]">
                            <span className="relative z-10">{b}</span>
                        </Link>
                    </div>
                ))
            }
        </div>
    )
}

export default BrandList