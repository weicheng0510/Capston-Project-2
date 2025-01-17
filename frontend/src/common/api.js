const Domain = process.env.VITE_BACKEND_URL || 'http://localhost:5001';

const createEndpoint = (path, method) => ({
    url: `${Domain}/api/${path}`,
    method,
});

const Api = {
    signUp: createEndpoint('signup', 'post'),
    signIn: createEndpoint('signin', 'post'),
    currentUser: createEndpoint('user-details', 'get'),
    logout: createEndpoint('logout', 'get'),
    allUser: createEndpoint('all-users', 'get'),
    updateUser: createEndpoint('update-user', 'post'),
    uploadProduct: createEndpoint('upload-product', 'post'),
    allProducts: createEndpoint('products', 'get'),
    updateProduct: createEndpoint('update-product', 'post'),
    categoryProduct: createEndpoint('get-category-products', 'get'),
    brands: createEndpoint('get-brand', 'get'),
    randomProduct: createEndpoint('get-random-products', 'get'),
    categoryProducts: createEndpoint('category-products', 'post'),
    productDetail: createEndpoint('product-detail', 'post'),
    addToCart: createEndpoint('add-to-cart', 'post'),
    countCart: createEndpoint('count-cart', 'get'),
    viewCart: createEndpoint('view-cart', 'get'),
    updateCartQty: createEndpoint('update-cart-quantity', 'post'),
    removeCartProduct: createEndpoint('remove-cart-product', 'post'),
    searchProduct: createEndpoint('search', 'get'),
    filterPorduct: createEndpoint('filter-product', 'post'),
};


export default Api;