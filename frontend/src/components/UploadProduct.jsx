import React, { useContext, useState } from 'react';
import { AiOutlineCloseSquare } from "react-icons/ai";
import productCategory from '../common/productCategory';
import carBrand from '../common/carBrand';
import { FaUpload } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage'
import FullImage from './FullImage';
import { RiDeleteBin5Fill } from "react-icons/ri";
import Api from '../common/api';
import UserContext from '../contect/useContect';
import { toast } from 'react-toastify';

const UploadProduct = ({ onClose, fetchAllProducts }) => {
    const { token } = useContext(UserContext);
    const [data, setData] = useState({
        title: "",
        brand: "",
        model: "",
        category: "",
        image: [],
        description: "",
        price: "",
        quantity: ""
    })

    const [openImage, setOpenImage] = useState(false);
    const [fullImage, setFullImage] = useState("");

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(d => ({
            ...d,
            [name]: value
        }));
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        const uploadCloudinary = await uploadImage(file);

        setData((d) => {
            return {
                ...d,
                image: [...d.image, uploadCloudinary.url]
            }
        })
    }

    const handleDeleteImg = async (index) => {
        const newProductImage = [...data.image];
        newProductImage.splice(index, 1);
        setData((d) => {
            return {
                ...d,
                image: [...newProductImage]
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(Api.uploadProduct.url, {
            method: Api.uploadProduct.method,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const resData = await res.json();

        if (resData.success) {
            onClose();
            fetchAllProducts();
            toast.success(resData.message);
        } else {
            toast.error(resData?.message);
        }
    }

    return (
        <div className='flex fixed z-10 top-0 bottom-0 left-0 right-0 justify-center items-center bg-white bg-opacity-70'>
            <div className='bg-white shadow-lg p-4 pb-10 max-w-md w-full h-full max-h-[80%] overflow-hidden'>
                <div>
                    <button className='text-2xl ml-auto block' onClick={onClose}>
                        <AiOutlineCloseSquare />
                    </button>
                    <h1 className='font-bold text-xl mb-2'>Upload Product</h1>
                </div>
                <form className='overflow-y-scroll p-2 h-full max-h-[90%]' onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className='mb-2'>
                        <label htmlFor='title'>Product Title: </label>
                        <input type='text' id='title' name='title' value={data.title} onChange={handleOnChange} className='border border-gray-400 w-full p-1 bg-gray-100 rounded-md' required />
                    </div>
                    {/* Brand */}
                    <div className='mb-2'>
                        <label htmlFor='brand'> Car brand: </label>
                        <select value={data.brand} id='brand' name='brand' className='border border-gray-400 w-full p-1 bg-gray-100 rounded-md' onChange={handleOnChange} required>
                            <option value={''}>Select brand</option>
                            {
                                carBrand.map((e, index) => {
                                    return (
                                        <option value={e.value} key={index}>{e.label}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    {/* Category */}
                    <div className='mb-2'>
                        <label htmlFor='category'>Category: </label>
                        <select value={data.category} id='category' name='category' className='border border-gray-400 w-full p-1 bg-gray-100 rounded-md' onChange={handleOnChange} required>
                            <option value={''}>Select Category</option>
                            {
                                productCategory.map((e, index) => {
                                    return (
                                        <option value={e.value} key={index}>{e.label}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    {/* Model */}
                    <div className='mb-2'>
                        <label htmlFor='model'>Model: </label>
                        <input type='text' id='model' name='model' value={data.model} onChange={handleOnChange} className='border border-gray-400 w-full p-1 bg-gray-100 rounded-md' required />
                    </div>
                    {/* description */}
                    <div className='mb-2'>
                        <label htmlFor='description'>Description: </label>
                        <textarea id='description' name='description' value={data.description} onChange={handleOnChange} className='h-28 bg-gray-100 w-full border-gray-400 border p-1' rows={3} required>

                        </textarea>
                    </div>
                    <div className='flex gap-10'>
                        {/* price */}
                        <div className='mb-2'>
                            <label htmlFor='price'>Price: </label>
                            <input
                                type='number'
                                id='price'
                                name='price'
                                value={data.price}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d+(\.\d{0,2})?$/.test(value) || value === "") { // Allow up to 2 decimal places
                                        setData((d) => ({
                                            ...d,
                                            price: value
                                        }));
                                    }
                                }}
                                className='border border-gray-400 w-full p-1 bg-gray-100 rounded-md'
                                required />
                        </div>
                        {/* quantity */}
                        <div className='mb-2'>
                            <label htmlFor='quantity'>Quantity: </label>
                            <input
                                type='number'
                                id='quantity'
                                name='quantity'
                                value={data.quantity}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) { // Allow only whole numbers
                                        setData((d) => ({
                                            ...d,
                                            quantity: value
                                        }));
                                    }
                                }}
                                className='border border-gray-400 w-full p-1 bg-gray-100 rounded-md'
                                required />
                        </div>
                    </div>
                    {/* image */}
                    <div className='mb-2'>
                        <label htmlFor='image'>Image: </label>
                        <label htmlFor='uploadImage'>
                            <div className='p-2 bg-slate-100 border rounded h-20 w-full flex justify-center items-center cursor-pointer'>
                                <div className='text-gray-700 flex justify-center items-center flex-col gap-2'>
                                    <span className='text-2xl'><FaUpload /></span>
                                    <p className='text-base'>Upload Product Image</p>
                                    <input type='file' id='uploadImage' className='hidden' onChange={handleUploadImage} required />
                                </div>
                            </div>
                        </label>
                        <div className='mt-2'>
                            {
                                data?.image[0] ? (
                                    <div className='flex gap-2 flex-wrap'>
                                        {data.image.map((e, index) => {
                                            return (
                                                <div className='relative group' key={index}>
                                                    <img
                                                        src={e}
                                                        alt={e}
                                                        width={120}
                                                        height={120}
                                                        className='bg-slate-100 border cursor-pointer'
                                                        onClick={() => {
                                                            setOpenImage(true)
                                                            setFullImage(e)
                                                        }}
                                                    />
                                                    <div className='absolute top-0 right-0 text-white cursor-pointer text-xl bg-red-800 rounded hidden group-hover:block' onClick={() => handleDeleteImg(index)}>
                                                        <RiDeleteBin5Fill />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className='text-sm text-red-700'>*Please upload product image</p>
                                )
                            }
                        </div>
                    </div>
                    <button className='bg-gray-300 py-1 px-2 rounded-md hover:bg-gray-500 hover:text-white border-gray-600 border'>Submit</button>
                </form>
            </div>

            {/* display full screen image */}
            {
                openImage && (
                    <FullImage imgUrl={fullImage} onClose={() => setOpenImage(false)} />
                )
            }
        </div>
    )
}

export default UploadProduct