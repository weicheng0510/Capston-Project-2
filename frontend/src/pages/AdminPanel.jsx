import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { FaUserAlt } from "react-icons/fa";
import { Link, Outlet, useNavigate } from 'react-router';
import Role from '../common/role';


const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();


    useEffect(() => {
        if (user?.role !== Role.Admin) {
            navigate('/')
        }
    }, [user]);

    return (
        <div className='min-h-[calc(100vh-120px)] flex'>
            <aside className='max-w-32 bg-white min-h-full w-full shadow-inner lg:max-w-60'>
                <div className='h-fit flex justify-center items-center flex-col my-5'>
                    <div className='text-xl ' >
                        {
                            user?.photo ? (
                                <img src={user?.photo} className='w-20 h-20 rounded-full' alt={user?.username} />
                            ) : <FaUserAlt />
                        }
                    </div>
                    <p className='text-lg font-bold'>{user?.username}</p>
                    <p className='text-sm uppercase'>{user?.role}</p>
                </div>
                <div>
                    <nav className='grid'>
                        <Link to={"all-users"} className='py-3 px-6 hover:bg-slate-200'>All Users</Link>
                        <Link to={"products"} className='py-3 px-6 hover:bg-slate-200'>Products</Link>
                    </nav>
                </div>
            </aside>
            <main className='w-full h-full p-6'>
                <Outlet />
            </main>
        </div>
    )
}

export default AdminPanel