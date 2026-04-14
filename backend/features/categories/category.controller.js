const categoryService = require('./category.service');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories(req.orgId);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.orgId, req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.orgId, req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.orgId, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
