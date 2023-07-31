const productModel = require("../model/productModel");

exports.addNewProduct = async (req, res) => {
  try {
    const newProduct = await productModel.create({
      prodTitle: req.body.prodTitle,
      prodDescription: req.body.prodDescription,
      prodPrice: req.body.prodPrice,
      prodQuantity: req.body.prodQuantity,
      prodCategory: req.body.catId,
    });
    res.status(200).json({
      message: "Successfully generated",
      product: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productModel.deleteOne({
      _id: req.body.prodId,
    });
    res.status(200).json({
      message: "Successfully Deleted",
      deletedProduct: deletedProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await productModel.find({
      _id: req.body.prodId,
    });
    res.status(200).json({
      product: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, category } = req.body;

    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (title) product.prodTitle = title;
    if (description) product.prodDescription = description;
    if (price) product.prodPrice = price;
    if (quantity) product.prodQuantity = quantity;

    if (category) {
      // Find the category by name
      const categoryObj = await categoryModel.findOne({
        name: category,
      });
      if (!categoryObj) {
        return res.status(404).json({
          error: "Category not found",
        });
      }
      product.prodCategory = categoryObj._id;
    }

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update the product",
    });
  }
};
