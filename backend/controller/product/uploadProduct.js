const uploadPermission = require("../../helpers/permission");
const Product = require("../../models/Product");


async function uploadProductControll(req, res) {
    try {
        const sessionUser = req.user;

        if (!uploadPermission(sessionUser._id)) {
            throw new Error('Permission denied')
        }

        const uploadProduct = new Product(req.body);
        const saveProduct = await uploadProduct.save();

        res.status(201).json({
            message: "Product upload seccesfully",
            success: true,
            data: saveProduct
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        })
    }
}

module.exports = uploadProductControll;