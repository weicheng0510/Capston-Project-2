const Product = require('../../models/Product');

const getRandomProduct = async (req, res) => {
    try {
        const randomProducts = await Product.aggregate([
            { $sample: { size: 4 } } // Randomly select 4 products
        ]);

        res.json({
            message: "Random Products",
            success: true,
            data: randomProducts
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        });
    }
};

module.exports = getRandomProduct;