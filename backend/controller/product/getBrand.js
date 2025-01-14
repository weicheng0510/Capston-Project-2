const Product = require('../../models/Product');


const getBrand = async (req, res) => {
    try {
        const brand = await Product.distinct("brand");

        res.json({
            message: "brand list",
            data: brand,
            success: true
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = getBrand;
