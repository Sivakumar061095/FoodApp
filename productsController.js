const Products = require("./models/Products");
async function getProducts(req, res) {
  try {
    const products = await Products.find();
    res.status(201).json({ data: products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

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

async function createProduct(req, res) {
  try {
    const product = new Products(req.body);
    const savedProduct = await product.save();
    res.status(201).json({ data: savedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductbyId,
  deleteProductById,
};
