import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import Api from '../common/api';

const SimilarProduct = ({ category, limit = 4 }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const encodedCategory = encodeURIComponent(category);
            const res = await fetch(`${Api.categoryProducts.url}?category=${encodedCategory}&limit=${limit}`); // Include limit in query
            const resData = await res.json();
            setSimilarProducts(resData.data);
        } catch (error) {
            console.error('Error fetching category products:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCategory();
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-10 m-5 flex justify-center">
            <div className="w-full">
                <p className="text-2xl font-bold">Similar products:</p>
                <div className="flex flex-wrap items-center justify-between mt-3 px-10 md:px-0">
                    {similarProducts.map((p, i) => (
                        <div key={i} className="md:max-w-[49%] mb-6">
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimilarProduct;
