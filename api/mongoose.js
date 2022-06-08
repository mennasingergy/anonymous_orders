const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const orderSchema = new Schema({
  id: String,
  name: String,
  quantity: String,
  price: Number,
  order_status: { type: String, default: "processing" },
});
const RabbitOrder = mongoose.model("Orders", orderSchema);

module.exports = RabbitOrder;
