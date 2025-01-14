const Product = require('../../models/Product');

const getCategoryProducts = async (req, res) => {
    try {
        const { category, limit } = req.query; // Read 'limit' from query parameters
        const products = await Product.find({ category }).limit(Number(limit) || 0); // Apply limit if provided

        res.json({
            message: "Category products retrieved successfully",
            data: products,
            success: true
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        });
    }
};

module.exports = getCategoryProducts;
