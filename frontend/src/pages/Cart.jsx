import React, { useContext, useEffect, useState } from 'react';
import Api from '../common/api';
import UserContext from '../contect/useContect';
import { AiOutlineCloseSquare } from "react-icons/ai";
import { Link } from 'react-router';

const Cart = () => {
    const { token, cartCount, fetchCart } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const loadingCart = new Array(cartCount).fill(null);

    const fetchData = async () => {
        const res = await fetch(Api.viewCart.url, {
            method: Api.viewCart.method,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        const resData = await res.json();

        if (resData.success) {
            setData(resData.data)
        }
    }

    const addQty = async (id, qty) => {
        const res = await fetch(Api.updateCartQty.url, {
            method: Api.updateCartQty.method,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    productId: id,
                    quantity: qty + 1
                }
            )
        })
        const resData = await res.json();

        if (resData.success) {
            fetchData();
        }
    }

    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            const res = await fetch(Api.updateCartQty.url, {
                method: Api.updateCartQty.method,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        productId: id,
                        quantity: qty - 1
                    }
                )
            })
            const resData = await res.json();

            if (resData.success) {
                fetchData();
            }
        };
    }

    const removeProduct = async (id) => {
        const res = await fetch(Api.removeCartProduct.url, {
            method: Api.removeCartProduct.method,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    productId: id,
                }
            )
        })
        const resData = await res.json();

        if (resData.success) {
            fetchData();
            fetchCart();
        }
    }

    const totalQty = data.reduce((p, c) => p + c.quantity, 0);
    const totalPrice = data.reduce((p, c) => p + (c.quantity * c.productId.price), 0);

    const handleLoading = async () => {
        await fetchData();
    }

    useEffect(() => {
        setLoading(true);
        handleLoading();
        setLoading(false);
    }, [])


    return (
        <div className='container mx-auto'>
            <div className='text-center text-lg py-2 my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white py-5'>Cart is Empty!</p>
                    )
                }
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                {/* view product */}
                <div className='w-full max-w-3xl'>
                    {
                        loading ? (
                            loadingCart.map((e, i) => {
                                return (
                                    <div key={i} className='w-full bg-neutral-300 h-32 my-2 border border-neutral-400 animate-pulse rounded'>
                                    </div>
                                )
                            }
                            )
                        ) : (
                            data.map((p, i) => {
                                return (
                                    <div key={i} className='w-full bg-white h-36 my-2 border border-neutral-400 rounded grid grid-cols-[128px,1fr]'>
                                        <Link to={`/product/${p?.productId._id}`} className='w-36 h-36 bg-neutral-100'>
                                            <img src={p?.productId?.image[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                        </Link>
                                        <div className='px-7 py-2 relative'>
                                            {/* delete product */}
                                            <div className='absolute right-0 top-0 p-2 text-2xl hover:text-red-500 cursor-pointer' onClick={() => removeProduct(p?._id)}>
                                                <AiOutlineCloseSquare />
                                            </div>
                                            <Link to={`/product/${p?.productId._id}`} className='pr-4 text-lg lg:text-xl text-ellipsis line-clamp-2'>{p?.productId?.title}</Link>
                                            <p className='text-gray-700'>{p?.productId.category}</p>
                                            <p>${p?.productId.price} / Item</p>
                                            <div className='flex items-center gap-3'>
                                                <button className='border border-gray-500 w-5 h-5 flex justify-center items-center hover:bg-gray-300' onClick={() => decreaseQty(p?._id, p?.quantity)}>-</button>
                                                <span>{p?.quantity}</span>
                                                <button className='border border-gray-500 w-5 h-5 flex justify-center items-center hover:bg-gray-300' onClick={() => addQty(p?._id, p?.quantity)}>+</button>
                                                <p className='ml-3 text-xl font-bold'>${p?.productId.price * p?.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>

                {/* total */}
                {
                    data.length > 0 && (
                        <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                            {
                                loading ? (
                                    <div className='h-36 bg-neutral-300 border border-neutral-400 animate-pulse'>
                                    </div>
                                ) : (
                                    <div className='bg-white border border-gray-700'>
                                        <h2 className='bg-gray-800 text-white font-bold px-4 py-1 text-xl'>Summary</h2>
                                        <div className='flex items-center justify-between px-4 pt-1 gap-2 font-medium text-lg'>
                                            <p>Quantity</p>
                                            <p>{totalQty}</p>
                                        </div>

                                        <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg'>
                                            <p>Total Price</p>
                                            <p>${totalPrice}</p>
                                        </div>

                                        <button className='bg-gray-500 text-white w-full p-1 mt-2 font-medium text-lg hover:bg-gray-600'>Payment</button>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div >
    )
}

export default Cart