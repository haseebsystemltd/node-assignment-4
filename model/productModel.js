const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    prodTitle: {
      type: String,
    },
    prodDescription: {
      type: String,
    },
    prodPrice: {
      type: Number,
    },
    prodQuantity: {
      type: Number,
    },
    prodCategory: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
