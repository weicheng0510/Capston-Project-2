import React, { useContext, useState } from 'react';
import Role from '../common/role';
import { AiOutlineCloseSquare } from "react-icons/ai";
import Api from '../common/api';
import { toast } from 'react-toastify';
import UserContext from '../contect/useContect';

const ChangeRole = ({ username, role, userId, onClose, fetchAllUsers }) => {
    const { token } = useContext(UserContext);
    const [selectedRole, setSelectedRole] = useState("");

    const handleSelectChange = (e) => {
        setSelectedRole(e.target.value);
    }

    const updateUserRole = async () => {
        if (!selectedRole) {
            toast.error("Please select a valid role.");
            return;
        }

        const res = await fetch(Api.updateUser.url, {
            method: Api.updateUser.method,
            credentials: "include",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                role: selectedRole,
            })
        });

        const resData = await res.json();

        if (resData.success) {
            toast.success(resData.message);
            onClose();
            fetchAllUsers();
        } else {
            toast.error(resData.message);
        }
    }

    return (
        <div className='flex fixed z-10 top-0 bottom-0 left-0 right-0 justify-center items-center bg-white bg-opacity-70'>
            <div className='bg-white shadow-lg p-4 pt-2 pr-2 max-w-sm w-full'>
                <button className='text-2xl ml-auto block' onClick={onClose}>
                    <AiOutlineCloseSquare />
                </button>
                <h1 className='font-bold text-xl mb-2'>Change User Role</h1>
                <p>Username: {username}</p>
                <div className='flex mt-2'>
                    <p>Role:</p>
                    <select
                        className="border border-black px-2 ml-2 rounded-lg"
                        value={selectedRole}
                        onChange={handleSelectChange}
                    >
                        <option value="" disabled>
                            Select a role
                        </option>
                        {Object.values(Role).map((roleValue) => (
                            <option value={roleValue} key={roleValue}>
                                {roleValue}
                            </option>
                        ))}
                    </select>
                </div>

                <button className='bg-neutral-200 px-2 mt-4 rounded-sm border border-black hover:bg-neutral-300' onClick={updateUserRole}>Submit</button>
            </div>
        </div>
    )
}

export default ChangeRole