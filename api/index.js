require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const { mongoClient } = require('./mongo');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/:id', async (req, res) => {
  try {
    const post = await OrdersModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

app.post('/api', async (req, res) => {
  if (!req.body) {
    res.status(400);
    res.status(200).json("Please add you order");
  }
  const { name, quantity, price } = req.body;
  let order = new OrdersModel({
    name,
    quantity,
    price,
  });
  const results = await order.save();
  return res.json({
    id: results._doc._id,
    name,
    quantity,
    price
  })
});

app.delete('/api/:id', async (req, res) => {
  const post = await OrdersModel.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ msg: "Order not found" });
  }

  await post.remove();

  res.json({ msg: "Order removed" });
});

app.patch('/api/:id', async (req, res) => {
  try {
    OrdersModel.updateOne(
      { Shipment_status: "ReadyToShip" },
      { $set: { Order_status: "Shipped" } },
      { upsert: true }
    );
  } catch (e) {
    res.status(200).json("Error");
  }
  try {
    OrdersModel.updateOne(
      { Shipment_status: "Shipped" },
      { $set: { Order_status: "Delivered" } },
      { upsert: true }
    );
  } catch (e) {
    print(e);
  }
  try {
    OrdersModel.updateOne(
      { Shipment_status: "Canceled" },
      { $set: { Order_status: "Returned" } },
      { upsert: true }
    );
  } catch (e) {
    print(e);
  }
  try {
    OrdersModel.updateOne(
      { Order_Id: req.body.Order_Id },
      { $set: { Order_status: "Created" } },
      { upsert: true }
    );
  } catch (e) {
    print(e);
  }
});

app.listen(process.env.PORT || 5000, async () => {
  console.log("The server is running")
  //await connectDB();
});
