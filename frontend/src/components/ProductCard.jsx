import React from 'react'
import { Link } from 'react-router'

const ProductCard = ({ product }) => {

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <Link to={`/product/${product._id}`} className="flex flex-col items-center border  rounded-lg shadow lg:flex-row lg:max-w-xl border-gray-700 bg-gray-800 hover:bg-gray-700 lg:h-48 h-96" onClick={scrollTop}>
                <img className="object-cover w-56 rounded-t-lg h-56 md:h-auto lg:w-48 p-4 pb-1 md:rounded-none md:rounded-s-lg" src={product.image[0]} alt="" />
                <div className="flex flex-col justify-between p-4 pt-1 leading-normal">
                    <h5 className="text-lg lg:text-xl text-ellipsis line-clamp-2 font-bold tracking-tight text-gray-900 dark:text-white">{product.title}</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">Price: ${product.price}</p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">Qty: {product.quantity}</p>
                </div>
            </Link>
        </>
    )
}

export default ProductCard