const Product = require('../products/product.model');
const Stock = require('../stock/stock.model');
const Sale = require('../sales/sale.model');
const Purchase = require('../purchases/purchase.model');
const mongoose = require('mongoose');

class ReportService {
  /**
   * Get main dashboard KPIs.
   */
  async getDashboardKPIs(orgId, shopId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchBase = { orgId: new mongoose.Types.ObjectId(orgId) };
    if (shopId) matchBase.shopId = new mongoose.Types.ObjectId(shopId);

    // Today's sales (non-cancelled)
    const salesAgg = await Sale.aggregate([
      {
        $match: {
          ...matchBase,
          status: { $in: ['completed', 'draft'] },
          saleDate: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          totalSalesCount: { $sum: 1 },
          totalRevenue: { $sum: '$grandTotal' }
        }
      }
    ]);
    const salesData = salesAgg[0] || { totalSalesCount: 0, totalRevenue: 0 };

    // Total active products
    const totalProducts = await Product.countDocuments({ orgId, status: 'active' });

    // Low stock count (join Stock with Product to compare baseQuantity vs minStock)
    const lowStockAgg = await Stock.aggregate([
      { $match: { orgId: new mongoose.Types.ObjectId(orgId) } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $match: {
          $expr: {
            $and: [
              { $gt: ['$baseQuantity', 0] },
              { $lte: ['$baseQuantity', { $ifNull: ['$product.minStock', 0] }] }
            ]
          }
        }
      },
      { $count: 'count' }
    ]);
    const lowStockCount = lowStockAgg[0]?.count ?? 0;

    // Out of stock count
    const outOfStockAgg = await Stock.aggregate([
      { $match: { ...matchBase, baseQuantity: { $lte: 0 } } },
      { $count: 'count' }
    ]);
    const outOfStockCount = outOfStockAgg[0]?.count ?? 0;

    return {
      revenueToday: salesData.totalRevenue,
      salesToday: salesData.totalSalesCount,
      totalProducts,
      lowStockCount,
      outOfStockCount
    };
  }

  /**
   * Get Stock report — lists all stock entries with status classification.
   */
  async getStockReport(orgId, shopId) {
    const matchQuery = { orgId: new mongoose.Types.ObjectId(orgId) };
    if (shopId) matchQuery.shopId = new mongoose.Types.ObjectId(shopId);

    const stocks = await Stock.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 1,
          productId: 1,
          productName: '$product.name',
          sku: '$product.sku',
          baseQuantity: 1,
          displayUnit: 1,
          minStock: { $ifNull: ['$product.minStock', 0] },
          status: {
            $cond: [
              { $lte: ['$baseQuantity', 0] },
              'out_of_stock',
              {
                $cond: [
                  { $lte: ['$baseQuantity', { $ifNull: ['$product.minStock', 0] }] },
                  'low_stock',
                  'ok'
                ]
              }
            ]
          }
        }
      },
      { $sort: { status: 1, productName: 1 } }
    ]);
    return stocks;
  }

  /**
   * Get Sales Report — all non-cancelled sales in date range.
   */
  async getSalesReport(orgId, shopId, startDate, endDate, productId, categoryId) {
    const matchQuery = {
      orgId: new mongoose.Types.ObjectId(orgId),
      status: { $nin: ['cancelled'] }
    };
    if (shopId) matchQuery.shopId = new mongoose.Types.ObjectId(shopId);

    if (startDate || endDate) {
      matchQuery.saleDate = {};
      if (startDate) matchQuery.saleDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchQuery.saleDate.$lte = end;
      }
    }

    if (productId || categoryId) {
      const SaleItem = require('../sales/saleItem.model');
      const itemMatch = { orgId: new mongoose.Types.ObjectId(orgId) };
      if (productId) itemMatch.productId = new mongoose.Types.ObjectId(productId);
      
      let saleIds = await SaleItem.find(itemMatch).distinct('saleId');
      
      if (categoryId) {
        const Product = require('../products/product.model');
        const catProducts = await Product.find({ orgId, categoryId }).distinct('_id');
        const catSaleIds = await SaleItem.find({ orgId, productId: { $in: catProducts } }).distinct('saleId');
        
        // Dynamic intersect or union depending on if productId was also provided
        if (productId) {
          saleIds = saleIds.filter(id => catSaleIds.some(cid => cid.equals(id)));
        } else {
          saleIds = catSaleIds;
        }
      }
      
      matchQuery._id = { $in: saleIds };
    }

    const sales = await Sale.find(matchQuery)
      .populate('customerId', 'name')
      .sort({ saleDate: -1 })
      .lean();
    return sales;
  }

  /**
   * Get Purchase Report — confirmed/received purchases in date range.
   */
  async getPurchaseReport(orgId, shopId, startDate, endDate) {
    const matchQuery = {
      orgId: new mongoose.Types.ObjectId(orgId),
      status: { $in: ['confirmed', 'received', 'draft'] }
    };
    if (shopId) matchQuery.shopId = new mongoose.Types.ObjectId(shopId);

    if (startDate || endDate) {
      matchQuery.purchaseDate = {};
      if (startDate) matchQuery.purchaseDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchQuery.purchaseDate.$lte = end;
      }
    }

    const purchases = await Purchase.find(matchQuery)
      .populate('supplierId', 'name')
      .sort({ purchaseDate: -1 })
      .lean();
    return purchases;
  }

  /**
   * Get Monthly Summary - Sales vs Purchases trends for the last 6 months.
   */
  async getMonthlySummary(orgId, shopId) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const matchBase = { 
      orgId: new mongoose.Types.ObjectId(orgId),
      status: { $nin: ['cancelled'] }
    };
    if (shopId) matchBase.shopId = new mongoose.Types.ObjectId(shopId);

    // Aggregate Sales by month
    const salesMonthly = await Sale.aggregate([
      { 
        $match: { 
          ...matchBase,
          saleDate: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$saleDate' },
            month: { $month: '$saleDate' }
          },
          totalSales: { $sum: '$grandTotal' }
        }
      }
    ]);

    // Aggregate Purchases by month
    const purchaseMatch = {
      orgId: new mongoose.Types.ObjectId(orgId),
      status: { $in: ['confirmed', 'received'] },
      purchaseDate: { $gte: sixMonthsAgo }
    };
    if (shopId) purchaseMatch.shopId = new mongoose.Types.ObjectId(shopId);

    const purchasesMonthly = await Purchase.aggregate([
      { $match: purchaseMatch },
      {
        $group: {
          _id: { 
            year: { $year: '$purchaseDate' },
            month: { $month: '$purchaseDate' }
          },
          totalPurchases: { $sum: '$grandTotal' }
        }
      }
    ]);

    // Format and merge results
    const months = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const monthNum = d.getMonth() + 1;
      const yearNum = d.getFullYear();
      const monthName = d.toLocaleString('default', { month: 'short' });
      
      const s = salesMonthly.find(x => x._id.month === monthNum && x._id.year === yearNum);
      const p = purchasesMonthly.find(x => x._id.month === monthNum && x._id.year === yearNum);

      months.push({
        month: monthName,
        sales: s ? s.totalSales : 0,
        purchases: p ? p.totalPurchases : 0
      });
    }

    return months;
  }

  /**
   * Get Profit Report - Revenue, COGS and Gross Profit.
   */
  async getProfitReport(orgId, shopId, startDate, endDate) {
    const matchQuery = {
      orgId: new mongoose.Types.ObjectId(orgId),
      status: { $in: ['completed'] }
    };
    if (shopId) matchQuery.shopId = new mongoose.Types.ObjectId(shopId);

    if (startDate || endDate) {
      matchQuery.saleDate = {};
      if (startDate) matchQuery.saleDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchQuery.saleDate.$lte = end;
      }
    }

    const SaleItem = require('../sales/saleItem.model');
    const Product = require('../products/product.model');
    const Unit = require('../units/unit.model');

    const profitAgg = await SaleItem.aggregate([
      { $match: { orgId: new mongoose.Types.ObjectId(orgId) } },
      {
        $lookup: {
          from: 'sales',
          localField: 'saleId',
          foreignField: '_id',
          as: 'sale'
        }
      },
      { $unwind: '$sale' },
      // Re-apply date and shop filters from parent sale
      {
        $match: {
          'sale.status': 'completed',
          ...(shopId ? { 'sale.shopId': new mongoose.Types.ObjectId(shopId) } : {}),
          ...(matchQuery.saleDate ? { 'sale.saleDate': matchQuery.saleDate } : {})
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'units',
          let: { symbol: '$product.purchaseUnitSymbol' },
          pipeline: [
            { $match: { 
                $expr: { $eq: ['$symbol', '$$symbol'] },
                orgId: { $in: [new mongoose.Types.ObjectId(orgId), null] }
              } 
            }
          ],
          as: 'unitData'
        }
      },
      { $unwind: { path: '$unitData', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          // Normalize COGS: (baseQuantity / conversionToBase) * purchasePrice
          // Default conversionToBase to 1 if unit not found for simplicity
          cogs: {
            $multiply: [
              { $divide: ['$baseQuantity', { $ifNull: ['$unitData.conversionToBase', 1] }] },
              { $ifNull: ['$product.purchasePrice', 0] }
            ]
          },
          revenue: { $subtract: ['$total', '$taxAmount'] } // Pre-tax revenue
        }
      },
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          totalRevenue: { $sum: '$revenue' },
          totalCogs: { $sum: '$cogs' },
          quantity: { $sum: '$quantity' },
          unit: { $first: '$unit' }
        }
      },
      {
        $addFields: {
          grossProfit: { $subtract: ['$totalRevenue', '$totalCogs'] },
          margin: {
            $cond: [
              { $gt: ['$totalRevenue', 0] },
              { $multiply: [{ $divide: [{ $subtract: ['$totalRevenue', '$totalCogs'] }, '$totalRevenue'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { grossProfit: -1 } }
    ]);

    return profitAgg;
  }
}

module.exports = new ReportService();
