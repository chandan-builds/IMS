const Category = require('./category.model');

exports.getCategories = async (orgId) => {
  return await Category.find({ orgId }).sort({ sortOrder: 1 });
};

exports.createCategory = async (orgId, categoryData) => {
  const category = new Category({
    ...categoryData,
    orgId
  });
  return await category.save();
};

exports.updateCategory = async (orgId, id, updateData) => {
  return await Category.findOneAndUpdate(
    { _id: id, orgId }, 
    { $set: updateData }, 
    { new: true }
  );
};

exports.deleteCategory = async (orgId, id) => {
  return await Category.findOneAndDelete({ _id: id, orgId });
};
