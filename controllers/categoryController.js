const categoryModel = require("../model/categoryModel");

exports.addNewCategory = async (req, res) => {
  if ("categoryTitle" in req.body && req.body["categoryTitle"] != "") {
    const newCategory = await categoryModel.create({
      categoryTitle: req.body.categoryTitle,
    });
    res.status(200).json({
      message: "Successfully generated",
      category: newCategory,
    });
  } else {
    res.status(400).json({
      message: "categoryTitle missing in your request",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  if ("categoryId" in req.body && req.body["categoryId"] != "") {
    try {
      const deletedCategory = await categoryModel.deleteOne({
        _id: req.body.categoryId,
      });
      res.status(200).json({
        message: "Successfully Deleted",
        deletedCategory: deletedCategory,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "categoryId param missing in request",
    });
  }
};

exports.getCategory = async (req, res) => {
  if ("categoryId" in req.body && req.body["categoryId"] != "") {
    try {
      const category = await categoryModel.find({
        _id: req.body.categoryId,
      });
      res.status(200).json({
        category: category,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "categoryId param missing in request",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await categoryModel.updateOne(
      {
        _id: req.params.categoryId,
      },
      {
        categoryTitle: req.body.categoryTitle,
      }
    );
    res.status(200).json({
      category: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
