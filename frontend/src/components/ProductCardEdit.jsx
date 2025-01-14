import React, { useState } from 'react'
import { CiEdit } from "react-icons/ci";
import EditProduct from './EditProduct';
import { Link } from 'react-router';

const ProductCardEdit = ({ p, fetchProducts }) => {
    const [edit, setEdit] = useState(false);

    return (
        <div className="max-w-64  bg-white border border-gray-200 rounded-lg shadow flex flex-col items-center justify-center">
            <Link to={`/product/${p._id}`}>
                <img className="rounded-t-lg w-48 h-48 object-cover" src={p.image[0]} alt={p.title} />
            </Link>
            <div className="p-3 pt-1">
                <Link to={`/product/${p._id}`} >
                    <h5 className="text-lg tracking-tight text-gray-900 h-24 flex items-center">{p.title}</h5>
                </Link>
                <div className="mb-2 font-normal text-gray-700">
                    <p>Qty: {p.quantity}</p>
                    <p>Price: ${p.price}</p>
                </div>

                <div className="inline-flex items-center px-3 py-1 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 cursor-pointer" onClick={() => setEdit(true)}>
                    Edit
                    <span className='ml-1'><CiEdit /></span>
                </div>
            </div>

            {
                edit && (
                    <EditProduct product={p} onClose={() => setEdit(false)} fetchProducts={fetchProducts} />
                )
            }

        </div >
    )
}

export default ProductCardEdit