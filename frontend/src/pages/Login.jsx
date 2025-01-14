import React, { useState, useContext } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router';
import Api from '../common/api';
import { toast } from 'react-toastify';
import UserContext from '../contect/useContect';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({ username: '', password: '' });
    const { setToken } = useContext(UserContext); // Access setToken from context
    const navigate = useNavigate();

    const handleShowPassword = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(Api.signIn.url, {
                method: Api.signIn.method,
                credentials: 'include',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data),
            });

            const resData = await res.json();

            if (resData.success) {
                toast.success(resData.message);
                setToken(resData.token); // Update token in context
                navigate('/');
            } else {
                toast.error(resData.message);
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error('Login failed. Please try again.');
        }
    };
    return (
        <section id='login'>
            <div className='mx-auto container p-4'>
                <div className='bg-white p-2 w-full max-w-md mx-auto rounded-sm mt-10'>
                    <div className='text-5xl text-center my-3'>
                        Login
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label className='p-2 pb-0'>Username: </label>
                            <input
                                type='text'
                                placeholder='enter username'
                                name='username'
                                value={data.username}
                                onChange={handleChange}
                                className='outline-none bg-gray-100 p-2 mx-2'
                            />
                        </div>
                        <div className='grid'>
                            <label className='p-2 pb-0'>Password: </label>
                            <div className='bg-gray-100 flex items-center mx-2'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='enter password'
                                    name='password'
                                    value={data.password}
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

                        <button className='text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2 ml-2 mt-4'>Login</button>
                    </form>

                    <div className='ml-2 my-4'>Don't have account? <Link to={'/sign-up'} className='hover:underline text-blue-500 hover:text-blue-600'>Sign up</Link></div>
                </div>
            </div>
        </section>
    )
}

export default Login