import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router';
import userImg from '../assest/user-image.webp';
import imageToBase64 from '../helpers/imageToBase64';
import Api from '../common/api';
import { toast } from 'react-toastify';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword((value) => !value);
    }
    const handleShowConfirmPassword = () => {
        setShowConfirmPassword((value) => !value);
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const image = await imageToBase64(file);

        setData((d) => ({
            ...d,
            image: image
        }))
    }

    const navigate = useNavigate();

    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(d => ({
            ...d,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.password === data.confirmPassword) {
            const res = await fetch(Api.signUp.url, {
                method: Api.signUp.method,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resData = await res.json();

            if (resData.success) {
                toast.success(resData.message);
                navigate('/login')
            } else {
                toast.error(resData.message);
            }

        } else {
            toast.error("Password doesn't match.");
        }
    }


    return (
        <section id='singup'>
            <div className='mx-auto container p-4'>
                <div className='bg-white p-2 w-full max-w-md mx-auto rounded-sm mt-4'>
                    <div>
                        <div className='text-5xl text-center my-4'>
                            Sign Up
                        </div>
                        <div className='w-20 h-20 mx-auto mt-5 mb-2'>
                            <img src={data.image || userImg} alt='user-img' className='rounded-full w-20 h-20' />
                        </div>
                        <form className='text-center'>
                            <label className='text-sm bg-slate-200 rounded-md p-1 hover:text-white hover:bg-slate-700 cursor-pointer'>
                                Upload Photo
                                <input
                                    type='file'
                                    onChange={handleFileUpload}
                                    className='hidden'
                                />
                            </label>
                        </form>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label className='p-2 pb-0'>Username: </label>
                            <input
                                type='text'
                                placeholder='enter username'
                                name='username'
                                value={data.username}
                                required
                                onChange={handleChange}
                                className='outline-none bg-gray-100 p-2 mx-2'
                            />
                        </div>
                        <div className='grid'>
                            <label className='p-2 pb-0'>Email: </label>
                            <input
                                type='email'
                                placeholder='enter email'
                                name='email'
                                value={data.email}
                                required
                                onChange={handleChange}
                                className='outline-none bg-gray-100 p-2 mx-2'
                            />
                        </div>
                        <div className='grid'>
                            <label className='p-2 pb-0'>Password: </label>
                            <div className='bg-gray-100 mx-2 flex items-center'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='enter password'
                                    name='password'
                                    value={data.password}
                                    required
                                    onChange={handleChange}
                                    className='outline-none bg-transparent w-full p-2'
                                />
                                <span className='cursor-pointer text-lg p-2' onClick={handleShowPassword}>
                                    {
                                        showPassword ? <FaEyeSlash /> : <FaEye />
                                    }
                                </span>
                            </div>
                        </div>
                        <div className='grid'>
                            <label className='p-2 pb-0'>Confirm Password: </label>
                            <div className='bg-gray-100 mx-2 flex items-center'>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder='enter password'
                                    name='confirmPassword'
                                    value={data.confirmPassword}
                                    required
                                    onChange={handleChange}
                                    className='outline-none bg-transparent w-full p-2'
                                />
                                <span className='cursor-pointer text-lg p-2' onClick={handleShowConfirmPassword}>
                                    {
                                        showConfirmPassword ? <FaEyeSlash /> : <FaEye />
                                    }
                                </span>
                            </div>
                        </div>

                        <button className='text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2 ml-2 mt-4'>Sign up</button>
                    </form>
                    <div className='ml-2 my-4'>
                        Already have account? <Link to={'/login'} className='hover:underline text-blue-500 hover:text-blue-600'>
                            Login</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SignUp