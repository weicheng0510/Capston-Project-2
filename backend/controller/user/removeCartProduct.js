const Cart = require("../../models/Cart");

const removeCartProduct = async (req, res) => {
    try {
        const cartId = req.body.productId;

        const deletedCart = await Cart.findByIdAndDelete(cartId);

        if (!deletedCart) {
            // If product is not found, return a 400 error
            return res.status(400).json({
                message: "Product not found",
                success: false,
            });
        }

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