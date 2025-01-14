const Product = require("../../models/Product");


const searchProduct = async (req, res) => {
    try {
        const query = req.query.q;

        const regex = new RegExp(query, 'i', 'g');

        const product = await Product.find({
            '$or': [{ title: regex }, { brand: regex }, { category: regex }, { model: regex }]
        })

        res.json({
            message: "Search product list",
            success: true,
            data: product
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        });
    }
}

module.exports = searchProduct;