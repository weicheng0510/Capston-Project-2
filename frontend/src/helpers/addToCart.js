import { toast } from 'react-toastify';
import Api from '../common/api';

const addToCart = async (e, id, token) => {
    e.preventDefault();

    if (!token) {
        toast.error('Please log in');
        return;
    }

    try {
        const res = await fetch(Api.addToCart.url, {
            method: Api.addToCart.method,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: id
            })
        })

        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const resData = await res.json();

        if (resData.success) {
            toast.success(resData.message);
        } else {
            toast.error(resData.message);
        }
    } catch (error) {
        // Handles network errors or any unexpected issues
        console.error('Failed to add to cart:', error);
        toast.error('Something went wrong. Please try again.');
    }
}

export default addToCart;