const Cart = require("../../models/Cart");

const updateCartProductQty = async (req, res) => {
    try {
        const cartId = req.body.productId;

        const { quantity } = req.body;


        const updateProduct = await Cart.updateOne(
            { _id: cartId },
            { $set: { quantity } }
        );

        res.json({
            message: "Quantity updated successfully.",
            data: updateProduct,
            success: true,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = updateCartProductQty;