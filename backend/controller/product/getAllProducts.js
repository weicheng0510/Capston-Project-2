const Product = require('../../models/Product');

const getAllProducts = async (req, res) => {
    try {
        const allProduct = await Product.find().sort({ createdAt: -1 });

        res.json({
            message: "All Product",
            success: true,
            data: allProduct
        })


    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = getAllProducts;