const Domain = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const Api = {
    signUp: {
        url: `${Domain}/api/signup`,
        method: 'post'
    },
    signIn: {
        url: `${Domain}/api/signin`,
        method: 'post'
    },
    currentUser: {
        url: `${Domain}/api/user-details`,
        method: 'get'
    },
    logout: {
        url: `${Domain}/api/logout`,
        method: 'get'
    },
    allUser: {
        url: `${Domain}/api/all-users`,
        method: 'get'
    },
    updateUser: {
        url: `${Domain}/api/update-user`,
        method: 'post'
    },
    uploadProduct: {
        url: `${Domain}/api/upload-product`,
        method: 'post'
    },
    allProducts: {
        url: `${Domain}/api/products`,
        method: 'get'
    },
    updateProduct: {
        url: `${Domain}/api/update-product`,
        method: 'post'
    },
    categoryProduct: {
        url: `${Domain}/api/get-category-products`,
        method: 'get'
    },
    brands: {
        url: `${Domain}/api/get-brand`,
        method: 'get'
    },
    randomProduct: {
        url: `${Domain}/api/get-random-products`,
        method: 'get'
    },
    categoryProducts: {
        url: `${Domain}/api/category-products`,
        method: 'post'
    },
    productDetail: {
        url: `${Domain}/api/product-detail`,
        method: 'post'
    },
    addToCart: {
        url: `${Domain}/api/add-to-cart`,
        method: 'post'
    },
    countCart: {
        url: `${Domain}/api/count-cart`,
        method: 'get'
    },
    viewCart: {
        url: `${Domain}/api/view-cart`,
        method: 'get'
    },
    updateCartQty: {
        url: `${Domain}/api/update-cart-quantity`,
        method: 'post'
    },
    removeCartProduct: {
        url: `${Domain}/api/remove-cart-product`,
        method: 'post'
    },
    searchProduct: {
        url: `${Domain}/api/search`,
        method: 'get'
    },
    filterPorduct: {
        url: `${Domain}/api/filter-product`,
        method: 'post'
    },
};


export default Api;