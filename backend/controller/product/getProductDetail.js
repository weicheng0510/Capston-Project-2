const Product = require('../../models/Product');

const getProductDetail = async (req, res) => {
    try {
        const { productId } = req.body

        const product = await Product.findById(productId);

        res.json({
            message: "Product Detail",
            success: true,
            data: product
        });


    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        });
    }
};

module.exports = getProductDetail;