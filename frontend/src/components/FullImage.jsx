import React from 'react'
import { AiOutlineCloseSquare } from "react-icons/ai";

const FullImage = ({ imgUrl, onClose }) => {
    return (
        <div className='flex fixed z-10 top-0 bottom-0 left-0 right-0 justify-center items-center bg-gray-800 bg-opacity-90'>
            <div className='bg-white shadow-lg max-w-[80%] w-full max-h-[80%] h-full p-8 flex relative justify-center items-center'>
                <button className='text-2xl absolute top-0 right-0' onClick={onClose}>
                    <AiOutlineCloseSquare />
                </button>
                <div className='w-full h-full'>
                    <img src={imgUrl} className='w-full h-full object-contain' />
                </div>
            </div>
        </div>
    )
}

export default FullImage