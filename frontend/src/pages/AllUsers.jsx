import React, { useContext, useEffect, useState } from 'react'
import Api from '../common/api';
import UserContext from '../contect/useContect';
import { toast } from 'react-toastify';
import { MdModeEdit } from "react-icons/md";
import ChangeRole from '../components/ChangeRole';


const AllUsers = () => {
    const { token } = useContext(UserContext);
    const [allUsers, setAllUsers] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updateUser, setUpdateUser] = useState({
        username: "",
        role: "",
        _id: "",
    });

    const fetchAllUsers = async () => {
        setLoading(true);
        const res = await fetch(Api.allUser.url, {
            method: Api.allUser.method,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const resData = await res.json();

        if (resData.success) {
            setAllUsers(resData.data);
        } else {
            toast.error(resData.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchAllUsers();
    }, [])

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div>
            <table className='w-full table-fixed text-center bg-neutral-100 break-words'>
                <thead className='border-b border-black h-14 bg-neutral-400'>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>E-mail</th>
                        <th>Role</th>
                        <th>Created Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        allUsers.map((element, index) => {
                            return (
                                <tr key={index} className='border-b border-gray-300 h-12'>
                                    <td>{index + 1}</td>
                                    <td>{element?.username}</td>
                                    <td>{element?.email}</td>
                                    <td>{element?.role}</td>
                                    <td>{formatDate(element?.createdAt)}</td>
                                    <td>
                                        <button
                                            className='mx-auto flex items-center hover:text-blue-800'
                                            onClick={() => {
                                                setUpdateUser(element)
                                                setEditOpen(true)
                                            }}>Edit <MdModeEdit /></button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            {
                editOpen && (
                    <ChangeRole
                        onClose={() => setEditOpen(false)}
                        username={updateUser.username}
                        role={updateUser.role}
                        userId={updateUser._id}
                        fetchAllUsers={fetchAllUsers}
                    />
                )
            }

        </div>
    )
}

export default AllUsers