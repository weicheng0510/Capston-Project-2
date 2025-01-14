import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import Api from '../common/api';

const PicksForYou = () => {
    const [randomProducts, setRandomProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRandom = async () => {
        setLoading(true);
        try {
            const res = await fetch(Api.randomProduct.url);
            const resData = await res.json();
            setRandomProducts(resData.data);
        } catch (error) {
            console.error('Error fetching randoms:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRandom();
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className='container bg-neutral-100 p-4 mx-auto mb-5 flex justify-center'>
            <div className='xl:max-w-[90%]' >
                <p className='text-2xl font-bold ml-2'>
                    Picks For You
                </p>
                <div className='flex flex-wrap items-center justify-between mt-3 px-10 md:px-0'>
                    {
                        randomProducts.map((p, i) => (
                            <div key={i} className='md:max-w-[49%] mb-6 w-[90%]'>
                                <ProductCard product={p} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default PicksForYou