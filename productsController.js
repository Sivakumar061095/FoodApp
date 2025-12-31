const Products = require("./models/Products");
const {
  createProductSchema,
  updateProductSchema,
} = require("./productValidation");
const logger = require("./logger");
// To GET ALL PRODUCTS
async function getProducts(req, res) {
  try {
    logger.info(`${req.reqId} - request received to get all products`);
    const products = await Products.find();
    logger.info(`${req.reqId} - request completed to get all products`);
    res.status(201).json({ data: products });
  } catch (error) {
    logger.error(
      `${req.reqId} - request failed to get all products: ${error.message}`
    );
    res.status(400).json({ error: error.message });
  }
}
// GET PRODUCT BY ID
async function getProductById(req, res) {
  try {
    logger.info(
      `${req.reqId} - request received to get product by ID: ${req.params.id}`
    );
    const products = await Products.findById(req.params.id);

    if (!products) {
      logger.warn(`${req.reqId} - Product not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    logger.info(
      `${req.reqId} - request completed to get product by ID: ${req.params.id}`
    );
    res.status(201).json({ data: products });
  } catch (error) {
    logger.error(
      `${req.reqId} - request failed to get product by ID: ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
}

// DELETE PRODUCT
async function deleteProductById(req, res) {
  try {
    logger.info(
      `${req.reqId} - request received to delete product by ID: ${req.params.id}`
    );
    const deletedProduct = await Products.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      logger.warn(`${req.reqId} - Product not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Product not found" });
    }
    logger.info(
      `${req.reqId} - request completed to delete product by ID: ${req.params.id}`
    );
    res.status(201).json({ data: "Product deleted successfully" });
  } catch (error) {
    logger.error(
      `${req.reqId} - request failed to delete product by ID: ${error.message}`
    );
    res.status(400).json({ error: error.message });
  }
}

// CREATE PRODUCT
async function createProduct(req, res) {
  try {
    logger.info(`${req.reqId} - request received to create a new product`);
    const { error, value } = createProductSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      logger.warn(
        `${req.reqId} - Validation error while creating product: ${error.message}`
      );
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    // Save product to DB
    const product = new Products(value);
    const savedProduct = await product.save();
    logger.info(
      `${req.reqId} - request completed to create a new product with ID: ${savedProduct._id}`
    );
    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    logger.error(
      `${req.reqId} - request failed to create product: ${err.message}`
    );
    res.status(500).json({ success: false, message: err.message });
  }
}

// To UPDATE PRODUCT
async function updateProductbyId(req, res) {
  try {
    logger.info(
      `${req.reqId} - request received to update product by ID: ${req.params.id}`
    );
    const { error, value } = updateProductSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      logger.warn(
        `${req.reqId} - Validation error while updating product: ${error.message}`
      );
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

    if (!updatedProduct) {
      logger.warn(`${req.reqId} - Product not found with ID: ${req.params.id}`);
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    logger.info(
      `${req.reqId} - request completed to update product by ID: ${req.params.id}`
    );
    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    logger.error(
      `${req.reqId} - request failed to update product by ID: ${err.message}`
    );
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProductbyId,
};
