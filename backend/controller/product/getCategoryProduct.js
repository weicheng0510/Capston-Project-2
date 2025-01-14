const Product = require('../../models/Product');


const getCategoryProduct = async (req, res) => {
    try {
        const category = await Product.distinct("category");

        const productByCategory = [];

        for (let c of category) {
            const product = await Product.aggregate([
                { $match: { category: c } },
                { $sample: { size: 1 } } // Get one random document
            ]);

            if (product.length > 0) {
                productByCategory.push(product[0]);
            }
        }

        res.json({
            message: "category product",
            data: productByCategory,
            success: true
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = getCategoryProduct;