import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import Api from '../common/api';
import ProductCardEdit from '../components/ProductCardEdit';


// Pages for all the products
const Products = () => {
    const [openUploadProduct, setOpenUploadProduct] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    const fetchAllProducts = async () => {
        const res = await fetch(Api.allProducts.url);
        const resData = await res.json();
        setAllProducts(resData?.data || [])
    }

    useEffect(() => {
        fetchAllProducts();
    }, [])

    return (
        <div>
            {/* All products header */}
            <div className='bg-neutral-100 p-2 pr-6 flex justify-between items-center'>
                <h1 className='font-bold text-2xl'>All Product</h1>
                <button
                    className='text-blue-600 hover:text-blue-900'
                    onClick={() => setOpenUploadProduct(true)}
                >Upload Product</button>
            </div>

            {/* All Products */}
            <div className='flex bg-white gap-5 p-4 flex-wrap'>
                {
                    allProducts.map((p, i) => {
                        return (
                            <div key={i}>
                                <ProductCardEdit p={p} fetchProducts={fetchAllProducts} />
                            </div>

                        )
                    })
                }
            </div>



            {/* Upload Product Component */}
            {
                openUploadProduct && (
                    <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchAllProducts={fetchAllProducts} />
                )
            }

        </div>
    )
}

export default Products