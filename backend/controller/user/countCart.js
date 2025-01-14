const Cart = require("../../models/Cart");

const countCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const count = await Cart.countDocuments({
            userId: userId
        })

        res.json({
            message: 'Cart count',
            data: { count: count },
            success: true
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = countCart;