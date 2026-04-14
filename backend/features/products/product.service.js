const Product = require('./product.model');
const ProductVariant = require('./variant.model');
const { paginateQuery } = require('../../utils/paginateQuery');
const { generateSku } = require('../../utils/generateSku');
const { parseExcel, generateExcel } = require('../../utils/excelHelper');

exports.getProducts = async (orgId, queryParams) => {
  const filter = { orgId };

  // Text search
  if (queryParams.search) {
    filter.$text = { $search: queryParams.search };
  }

  // Filtering
  if (queryParams.categoryId) {
    filter.categoryId = queryParams.categoryId;
  }
  if (queryParams.status) {
    filter.status = queryParams.status;
  }
  if (queryParams.unitType) {
    filter.unitType = queryParams.unitType;
  }

  const query = Product.find(filter).populate('categoryId', 'name');

  return await paginateQuery(query, queryParams);
};

exports.getProductById = async (orgId, id) => {
  return await Product.findOne({ _id: id, orgId }).populate('categoryId', 'name');
};

exports.createProduct = async (orgId, productData) => {
  if (!productData.sku) {
    productData.sku = generateSku();
  }

  const product = new Product({
    ...productData,
    orgId
  });

  return await product.save();
};

exports.updateProduct = async (orgId, id, updateData) => {
  return await Product.findOneAndUpdate(
    { _id: id, orgId },
    { $set: updateData },
    { new: true }
  );
};

exports.deleteProduct = async (orgId, id) => {
  return await Product.findOneAndUpdate(
    { _id: id, orgId },
    { $set: { status: 'discontinued' } }, // Soft delete as per status options
    { new: true }
  );
};

exports.importProducts = async (orgId, fileBuffer) => {
  const data = parseExcel(fileBuffer);
  
  const productsToInsert = data.map(item => {
    return {
      orgId,
      name: item.name,
      slug: item.slug,
      sku: item.sku || generateSku(),
      barcode: item.barcode,
      categoryId: item.categoryId, // ensure this is valid ObjectId
      unitType: item.unitType,
      baseUnitSymbol: item.baseUnitSymbol,
      purchaseUnitSymbol: item.purchaseUnitSymbol,
      saleUnitSymbol: item.saleUnitSymbol,
      purchasePrice: item.purchasePrice,
      salePrice: item.salePrice,
      status: item.status || 'active'
    };
  });

  const result = await Product.insertMany(productsToInsert, { ordered: false });
  return { message: `${result.length} products imported successfully` };
};

exports.exportProducts = async (orgId, queryParams) => {
  const filter = { orgId };

  if (queryParams.categoryId) filter.categoryId = queryParams.categoryId;
  if (queryParams.status) filter.status = queryParams.status;

  const products = await Product.find(filter).lean();
  
  // Format for excel
  const dataForExcel = products.map(p => ({
    Id: p._id.toString(),
    Name: p.name,
    SKU: p.sku,
    Barcode: p.barcode,
    Brand: p.brand,
    Category: p.categoryId ? p.categoryId.toString() : '',
    BaseUnit: p.baseUnitSymbol,
    PurchasePrice: p.purchasePrice,
    SalePrice: p.salePrice,
    Status: p.status,
  }));

  return generateExcel(dataForExcel, 'Products');
};
