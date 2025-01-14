const Cart = require("../../models/Cart");

const removeCartProduct = async (req, res) => {
    try {
        const cartId = req.body.productId;

        const deletedCart = await Cart.findByIdAndDelete(cartId);

        res.json({
            message: "Remove product successfully.",
            data: deletedCart,
            success: true,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = removeCartProduct;