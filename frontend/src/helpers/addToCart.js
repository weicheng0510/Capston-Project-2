import { toast } from 'react-toastify';
import Api from '../common/api';

const addToCart = async (e, id, token) => {
    e.preventDefault();

    if (!token) {
        toast.error('Please log in');
        return;
    }

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

    const resData = await res.json();

    if (resData.success) {
        toast.success(resData.message);
    } else {
        toast.error(resData.message);
    }

}

export default addToCart;