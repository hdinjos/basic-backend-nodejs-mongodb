const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemModel = new Schema({
  itemName: { type: String, required: true },
  itemColor: { type: String, required: true },
  itemDescription: { type: String, required: true },
  itemQty: { type: Number, required: true }
})

module.exports = mongoose.model('Item', itemModel);