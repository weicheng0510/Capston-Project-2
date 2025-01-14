import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import Api from '../common/api';

const SearchProduct = () => {
    const query = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProduct = async () => {
        setLoading(true);
        const res = await fetch(Api.searchProduct.url + query.search);
        const resData = await res.json();
        setData(resData.data);
        setLoading(false);
    }

    useEffect(() => {
        fetchProduct();
    }, [query])

    return (
        <div className='container mx-auto p-4'>
            {
                loading && (
                    <p className='text-lg text-center'>Loading...</p>
                )
            }
            <p className='text-lg pb-2'>Search Result: {data.length}</p>
            {
                data.length === 0 && !loading && (
                    <p className='bg-white text-lg text-center p-4'>No Item found</p>
                )
            }
            <div className='bg-white p-6'>
                {
                    data.length !== 0 && !loading && (
                        data.map((p, i) => {
                            return (
                                <div key={i} className='w-full bg-white h-48 p-2 py-4 border-b border-neutral-400 grid grid-cols-[128px,1fr]'>
                                    <Link to={`/product/${p._id}`} className='w-36 h-36 bg-neutral-100'>
                                        <img src={p?.image[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                    </Link>
                                    <div className='pl-10 relative'>
                                        <Link to={`/product/${p._id}`} className='pr-4 text-lg lg:text-xl text-ellipsis line-clamp-2'>{p?.title}</Link>
                                        <p>Car brand: {p?.brand}</p>
                                        <p>Model: {p?.model}</p>
                                        <p className='text-gray-700'>{p?.category}</p>
                                        <p>${p?.price} / Item</p>
                                    </div>
                                </div>
                            )
                        })
                    )
                }
            </div>

        </div>
    )
}

export default SearchProduct