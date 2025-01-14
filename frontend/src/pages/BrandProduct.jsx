import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import Api from '../common/api';

const BrandProduct = () => {
    const params = useParams();
    const [brand, setBrand] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState({ [params.brand]: true });
    const [filter, setfilter] = useState([]);

    const fetchBrand = async () => {
        setLoading(true);
        try {
            const res = await fetch(Api.brands.url);
            const resData = await res.json();
            setBrand(resData.data);
        } catch (error) {
            console.error('Error fetching brand:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        const res = await fetch(Api.filterPorduct.url, {
            method: Api.filterPorduct.method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                brand: filter
            })
        })
        const resData = await res.json();

        setData(resData.data);
        setLoading(false);
    }

    const handleSelect = (e) => {
        const { value, checked } = e.target;
        setSelect((pre) => {
            return {
                ...pre,
                [value]: checked
            }
        })
    }

    useEffect(() => {
        fetchBrand();
        if (params.brand) {
            setSelect((prev) => ({
                ...prev,
                [params.brand]: true,
            }));
            fetchData();
        }
    }, [])

    useEffect(() => {
        const arrBrand = Object.keys(select).map(key => {
            if (select[key]) {
                return key;
            }
            return null
        }).filter(e => e);

        setfilter(arrBrand);
    }, [select]);

    useEffect(() => {
        fetchData();
    }, [filter]);

    return (
        <div className='container mx-auto p-4'>
            {/* lg screen */}
            <div className='hidden lg:grid grid-cols-[200px,1fr]'>
                {/* side bar */}
                <div className='bg-white py-2 px-1 min-h-[calc(100vh-110px)]'>
                    <div >
                        <div className='text-lg font-medium border-b-2 border-gray-400 pl-3'>Brand</div>
                        <form className='flex flex-col gap-2 py-2'>
                            {
                                brand.map((b, i) => {
                                    return (
                                        <div key={i} className='flex items-center gap-3'>
                                            <input type='checkbox' name='brand' id={b} value={b} onChange={handleSelect} checked={!!select[b]} />
                                            <label htmlFor={b}>{b}</label>
                                        </div>
                                    )
                                })
                            }
                        </form>
                    </div>
                </div>

                {/* main */}
                <div className='bg-white ml-10 p-4'>
                    {
                        data.length !== 0 && !loading && (
                            data.map((p, i) => {
                                return (
                                    <div key={i} className='w-full bg-white h-48 p-2 py-4 border-b border-neutral-400 grid grid-cols-[128px,1fr]'>
                                        <Link to={`/product/${p?._id}`} className='w-36 h-36 bg-neutral-100'>
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
                    {
                        data.length === 0 && !loading && (
                            <div className='mt-6 text-lg text-center'>No item found</div>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default BrandProduct;