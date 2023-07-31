const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");
const nodemailer = require('nodemailer');

exports.addNewCartProduct = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    const product = await productModel.findById(productId);
    if (product.length == 0) {
      return res.status(404).send({
        error: "Product not found",
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).send({
        error: "Insufficient product quantity",
      });
    }

    let cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      // If the cart doesn't exist, create a new one
      cart = await cartModel.create({
        user: userId,
        products: [
          {
            productId: productId,
            quantity: quantity,
          },
        ],
      });
    } else {
      // If the cart exists, update it with the new product

      const existingProduct = cart.products.find(
        (product) => product.productId.toString() === productId
      );

      if (existingProduct) {
        // If the product already exists in the cart, update the quantity
        existingProduct.quantity += quantity;
      } else {
        // If the product doesn't exist in the cart, add it
        cart.products.push({
          productId,
          quantity,
        });
      }
    }

    // Update the product quantity in the product schema
    product.quantity -= quantity;
    await product.save();

    await cart.save();

    res.status(200).send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Failed to add product to cart",
    });
  }
};

exports.deleteCartProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).send({
        error: "Cart not found",
      });
    }

    const existingProductIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );
    if (existingProductIndex === -1) {
      return res.status(404).send({
        error: "Product not found in cart",
      });
    }

    const existingProduct = cart.products[existingProductIndex];

    // Update the product quantity in the product schema
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).send({
        error: "Product not found",
      });
    }
    product.quantity += existingProduct.quantity;
    await product.save();

    // Remove the product from the cart
    cart.products.splice(existingProductIndex, 1);
    await cart.save();

    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({
      error: "Failed to remove product from cart",
    });
  }
};

exports.getCartProduct = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({
        userId: req.params.id,
      })
      .populate("products.productId");
    if (!cart) {
      return res.status(404).send({
        error: "Cart not found",
      });
    }
    res.send(cart);
  } catch (error) {
    res.status(500).send({
      error: "Failed to retrieve the cart",
    });
  }
};

exports.checkout = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await cartModel.findOne({
      userId,
    });
    if (!cart) {
      console.log(userId);
      return res.status(404).send({
        error: "Cart not found",
      });
    }

    // Check if the cart is empty
    if (cart.products.length === 0) {
      return res.status(400).send({
        error: "Cart is empty",
      });
    }

    // Clear the cart
    cart.products = [];
    await cart.save();

    // Send email to the user
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "9b5b4daa9e9b38",
        pass: "66e8245bb2a569",
      },
    });

    const mailOptions = {
      from: "haseebanjum8421@gmail.com",
      to: "haseebanjum8421@gmail.com",
      subject: "Order Confirmation",
      text: "Your order has been successfully placed. Thank you ",
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });

    res.status(200).send({
      message: "Checkout successful",
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to process checkout",
    });
  }
};
