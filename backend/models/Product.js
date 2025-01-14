const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: String,
    brand: String,
    model: String,
    category: String,
    image: [],
    description: String,
    price: Number,
    quantity: Number
}, {
    timestamps: true
})

const Product = mongoose.model('product', productSchema)

module.exports = Product;