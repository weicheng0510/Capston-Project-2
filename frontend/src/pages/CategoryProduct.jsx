import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import Api from '../common/api';

const CategoryProduct = () => {
    const params = useParams();
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState({ [params.category]: true });
    const [filter, setfilter] = useState([]);

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

    const fetchData = async () => {
        setLoading(true);
        const res = await fetch(Api.filterPorduct.url, {
            method: Api.filterPorduct.method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                category: filter
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
        fetchCategory();
        if (params.category) {
            setSelect((prev) => ({
                ...prev,
                [params.category]: true,
            }));
            fetchData();
        }
    }, [])

    useEffect(() => {
        const arrCategory = Object.keys(select).map(key => {
            if (select[key]) {
                return key;
            }
            return null
        }).filter(e => e);

        setfilter(arrCategory);
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
                        <div className='text-lg font-medium border-b-2 border-gray-400 pl-3'>Category</div>
                        <form className='flex flex-col gap-2 py-2'>
                            {
                                category.map((category, i) => {
                                    return (
                                        <div key={i} className='flex items-center gap-3'>
                                            <input type='checkbox' name='category' id={category.category} value={category.category} onChange={handleSelect} checked={!!select[category.category]} />
                                            <label htmlFor={category.category}>{category.category}</label>
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

export default CategoryProduct