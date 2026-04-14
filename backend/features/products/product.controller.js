const productService = require('./product.service');

exports.getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.orgId, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.orgId, req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.orgId, req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.orgId, req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.orgId, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.importProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const result = await productService.importProducts(req.orgId, req.file.buffer);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.exportProducts = async (req, res, next) => {
  try {
    const buffer = await productService.exportProducts(req.orgId, req.query);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="products.xlsx"');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
