const Product = require("../../models/Product");
const uploadPermission = require('../../helpers/permission');

const updateProduct = async (req, res) => {
    try {
        const sessionUser = req.user;
        if (!sessionUser || !sessionUser._id) {
            throw new Error('User not authenticated');
        }

        const hasPermission = await uploadPermission(sessionUser._id);
        if (!hasPermission) {
            throw new Error('Permission denied');
        }

        const { _id, ...updateFields } = req.body; // Exclude _id from the update payload

        const updatedProduct = await Product.findByIdAndUpdate(_id, updateFields, { new: true });
        if (!updatedProduct) {
            throw new Error('Product not found');
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = updateProduct;
