const Product = require('../../models/Product');

const filterProduct = async (req, res) => {
    try {
        const filter = req.body;

        // Extract the field name and its corresponding values
        const field = Object.keys(filter)[0]; // e.g., "category"
        const values = filter[field]; // e.g., ["Fog & Spot Lamp"]

        const products = await Product.find({
            [field]: { $in: values },
        });

        res.json({
            message: "filter Product",
            success: true,
            data: products
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = filterProduct;