import React, { useContext, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import '../style/navbar.css'
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../common/api';
import { toast } from 'react-toastify';
import UserContext from '../contect/useContect';
import { setUserDetails } from '../store/userSlice';
import Role from '../common/role';

const Navbar = () => {
    const { setToken, cartCount } = useContext(UserContext);
    const user = useSelector(state => state?.user?.user);
    const dispatch = useDispatch()
    const [display, setDisplay] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();


    const logout = async () => {
        const res = await fetch(Api.logout.url, {
            method: Api.logout.method,
        })

        const data = await res.json()

        if (data.success) {
            setToken(null);
            dispatch(setUserDetails(null));
            toast.success(data.message);
            navigate('/');
        }
        if (data.error) {
            toast.error(data.error);
        }
    }

    const handldeSearch = (e) => {
        const { value } = e.target;
        setSearch(value);
    }

    return (
        <nav className='h-16 shadow-lg bg-neutral-100'>
            <div className='h-full container mx-auto flex items-center px-4 justify-between'>
                <Link to={'/'}>
                    <div className='logo'>
                        Parts Search
                    </div>
                </Link>

                {/* search bar */}
                <div className='hidden lg:flex items-center w-full justify-between max-w-sm border border-gray-400 rounded-full focus-within:shadow-md pl-2 bg-white'>
                    <input type='text' placeholder='search product here...' className='w-full outline-none pl-2' onChange={handldeSearch} />
                    <Link to={`/search?q=${search}`} className='text-lg min-w-[50px] h-8 flex items-center pl-3 rounded-r-full bg-slate-400 cursor-pointer'>
                        <IoSearch />
                    </Link>
                </div>

                {/* user */}
                <div className='flex items-center gap-6'>
                    <div className='relative flex justify-center'>
                        {/* user icon */}
                        {
                            user?._id && (
                                <div id='userIcon' className='text-xl' onClick={() => setDisplay(p => !p)}>
                                    {
                                        user?.photo ? (
                                            <img src={user?.photo} className='w-10 h-10 rounded-full' alt={user?.username} />
                                        ) : <FaUserAlt />
                                    }
                                </div>
                            )
                        }
                        {/* user bar */}
                        {
                            user?.role === Role.Admin && display && (
                                <div className='absolute bottom-0 top-10 h-fit bg-neutral-100 p-2 py-3 shadow-lg z-10'>
                                    <nav>
                                        <Link to={"/admin-panel/products"} className='whitespace-nowrap hover:bg-neutral-200 p-2' onClick={() => setDisplay(p => !p)}>Admin Panel</Link>
                                    </nav>
                                </div>
                            )
                        }
                    </div>
                    {/* cart */}
                    {
                        user?._id && (
                            <Link to={'/cart'} className='text-xl cursor-pointer hover:text-gray-400'>
                                <span className='flex items-center'><FaShoppingCart /><div>[{cartCount}]</div></span>
                            </Link>
                        )
                    }
                    {/* login & logout */}
                    <div>
                        {
                            user?._id ? (
                                <button onClick={logout} className='hover:text-gray-400 text-xl flex items-center'>Logout</button>
                            ) : (
                                <Link to={'/login'}>
                                    <button className='hover:text-gray-400 text-xl flex items-center'>Login <span className='text-2xl'><IoLogInOutline /></span></button>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar