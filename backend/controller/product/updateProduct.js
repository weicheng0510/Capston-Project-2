const Product = require("../../models/Product");
const uploadPermission = require('../../helpers/permission');

async function updateProduct(req, res) {
    try {
        if (!uploadPermission(req.user._id)) {
            throw new Error('Permission denied');
        }

        const { _id, ...resBody } = req.body;

        const update = await Product.findByIdAndUpdate(_id, resBody, { new: true });

        res.json({
            message: "Product update successfully",
            data: update,
            success: true
        })


    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = updateProduct;