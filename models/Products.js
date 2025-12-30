var mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },

    category: {
      type: [String],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    final_price: {
      type: Number,
      required: true,
      min: 0,
    },

    is_veg: {
      type: Boolean,
      required: true,
    },

    is_available: {
      type: Boolean,
      default: true,
    },

    preparation_time: {
      type: Number,
      min: 0,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    image_url: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Products", productSchema);
