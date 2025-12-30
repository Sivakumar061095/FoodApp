const Products = require("./models/Products");
const {
  createProductSchema,
  updateProductSchema,
} = require("./productValidation");
// To GET ALL PRODUCTS
async function getProducts(req, res) {
  try {
    const products = await Products.find();
    res.status(201).json({ data: products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
// GET PRODUCT BY ID
async function getProductById(req, res) {
  try {
    const products = await Products.findById(req.params.id);
    if (!products)
      return res.status(404).json({ message: "Product not found" });
    res.status(201).json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//  CREATE PRODUCT
async function createProduct(req, res) {
  try {
    const product = new Products(req.body);
    const savedProduct = await product.save();
    res.status(201).json({ data: savedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
// To UPDATE PRODUCT BY ID
async function updateProductbyId(req, res) {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(201).json({ data: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
// DELETE PRODUCT
async function deleteProductById(req, res) {
  try {
    const deletedProduct = await Products.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(201).json({ data: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// CREATE PRODUCT
async function createProduct(req, res) {
  try {
    const { error, value } = createProductSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    // Save product to DB
    const product = new Products(value);
    const savedProduct = await product.save();

    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// To UPDATE PRODUCT
async function updateProduct(req, res) {
  try {
    const { error, value } = updateProductSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    const productId = req.params.id;

    //  To Update product in DB
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      { $set: value },
      { new: true }
    );

    if (!updatedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductbyId,
  deleteProductById,
  createProduct,
  updateProduct,
};
