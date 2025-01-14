const Cart = require("../../models/Cart");

const addToCart = async (req, res) => {
    try {
        const { productId } = req?.body;
        const currentUser = req.user._id;

        const productCheck = await Cart.findOne({ productId: productId, userId: currentUser });

        if (productCheck) {
            return res.json({
                message: 'Already add to cart',
                success: false
            })
        }

        const payload = {
            productId: productId,
            quantity: 1,
            userId: currentUser,
        };

        const newAddToCart = new Cart(payload);

        const saveCart = await newAddToCart.save();

        res.status(200).json({
            data: saveCart,
            success: true,
            message: "Product added",
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = addToCart;