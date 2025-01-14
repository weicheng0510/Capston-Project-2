const Cart = require("../../models/Cart");

const viewCart = async (req, res) => {
    try {
        const currentUser = req.user._id;

        const products = await Cart.find({
            userId: currentUser
        }).populate("productId")

        res.json({
            message: 'View Cart',
            data: products,
            success: true
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = viewCart;