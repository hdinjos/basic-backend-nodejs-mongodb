const express = require("express");
const mongoose = require('mongoose');
const { check, validationResult } = require("express-validator");
const Item = require('../model/Item');

const router = express.Router();


// CRUD items
router.get('/items', async (req, res) => {
  const item = await Item.find({});
  res.status(200).json({
    status: 200,
    data: item.map(i => ({
      id: i._id,
      itemName: i.itemName,
      itemColor: i.itemColor,
      itemDescription: i.itemDescription,
      itemQty: i.itemQty
    }))
  });
});

router.get('/item/:id', async (req, res) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        status: 404,
        message: 'id/data not found'
      });
    }
    res.status(200).json({
      status: 200,
      data: {
        id: item._id,
        itemName: item.itemName,
        itemColor: item.itemColor,
        itemDescription: item.itemDescription,
        itemQty: item.itemQty
      }
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: 'id/data not valid'
    })
  }
});

router.post('/item', check("itemName").notEmpty(), check("itemColor").notEmpty(), check("itemDescription").notEmpty(), check("itemQty").isNumeric().withMessage('itemQty must a number'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors.array()
    });
  };

  const { itemName, itemColor, itemDescription, itemQty } = req.body;
  const item = new Item({
    itemName, itemColor, itemDescription, itemQty: Number(itemQty)
  })
  await item.save();

  res.status(201).json({
    status: 201,
    message: "Add item success"
  });
});

router.put('/item/:id', check("itemName").notEmpty(), check("itemColor").notEmpty(), check("itemDescription").notEmpty(), check("itemQty").isNumeric().withMessage('itemQty must a number'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors.array()
    });
  };

  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const { itemName, itemColor, itemDescription, itemQty } = req.body
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        status: 404,
        message: 'id/data not found'
      })
    }
    item.itemName = itemName;
    item.itemColor = itemColor;
    item.itemDescription = itemDescription;
    item.itemQty = Number(itemQty);

    await item.save();
    res.status(200).json({
      status: 200,
      message: "update item success"
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: 'id/data not valid'
    })
  }
});

router.delete('/item/:id', async (req, res) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const item = await Item.deleteOne({ _id: id });
    if (item.deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: 'id/data not found'
      })
    }

    res.status(200).json({
      status: 200,
      message: "delete item success"
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: 'id/data not valid'
    })
  }
});

module.exports = router;