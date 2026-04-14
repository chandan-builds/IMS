const Stock = require('./stock.model');
const StockTransaction = require('./stockTransaction.model');
const Unit = require('../units/unit.model');
const unitConverter = require('../../utils/unitConverter');
const mongoose = require('mongoose');

class StockService {
  /**
   * Internal method to process stock out/in
   * Calculates base quantity and performs adjustments
   */
  async processTransaction(session, payload) {
    const { 
      orgId, shopId, productId, variantId, 
      type, quantity, unitSymbol, referenceType, 
      referenceId, note, createdBy, batchNumber, expiryDate 
    } = payload;

    // Positive or negative based on type
    const isAddition = ["purchase", "adjustment", "return", "transfer_in"].includes(type);
    
    // Convert to base unit
    // Note: We search for custom product conversions ideally, but for now we look up the global unit
    // To fully comply with the plan, we should fetch product overrides too if needed.
    // For simplicity, we just use global units.
    const unitDefs = await Unit.find({ $or: [{ orgId }, { orgId: null }] }).session(session);
    const baseQuantityToAdjust = unitConverter.toBaseUnit(Math.abs(quantity), unitSymbol, unitDefs);
    
    const adjustment = isAddition ? baseQuantityToAdjust : -baseQuantityToAdjust;

    // Find or create stock document
    let stock = await Stock.findOne({ orgId, shopId, productId, variantId }).session(session);
    
    if (!stock) {
      if (!isAddition) throw new Error("Cannot reduce stock below zero for an item that has no stock record.");
      stock = new Stock({
        orgId, shopId, productId, variantId, baseQuantity: 0, displayUnit: unitSymbol
      });
    }

    const balanceAfter = stock.baseQuantity + adjustment;

    // Prevent negative stock (could check org settings for allowNegativeStock)
    if (balanceAfter < 0) {
      throw new Error(`Insufficient stock. Available: ${stock.baseQuantity}`);
    }

    // Update stock
    stock.baseQuantity = balanceAfter;
    stock.lastUpdated = new Date();
    await stock.save({ session });

    // Create transaction
    const transaction = new StockTransaction({
      orgId, shopId, productId, variantId,
      type, quantity, unit: unitSymbol,
      baseQuantity: adjustment,
      balanceAfter,
      referenceType, referenceId, note, createdBy,
      batchNumber, expiryDate
    });
    await transaction.save({ session });

    return { stock, transaction };
  }

  /**
   * Adjust stock manually
   */
  async adjustStock(orgId, shopId, userId, payload) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const result = await this.processTransaction(session, {
        orgId,
        shopId,
        createdBy: userId,
        referenceType: 'adjustment',
        referenceId: null, // No reference ID for manual adjustment
        ...payload
      });
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Transfer stock between shops
   */
  async transferStock(orgId, userId, payload) {
    const { fromShopId, toShopId, productId, variantId, quantity, unitSymbol, note } = payload;
    
    if (fromShopId.toString() === toShopId.toString()) {
      throw new Error("Cannot transfer to the same shop");
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // 1. Transfer Out
      await this.processTransaction(session, {
        orgId, shopId: fromShopId, productId, variantId,
        type: 'transfer_out', quantity, unitSymbol,
        referenceType: 'transfer', note, createdBy: userId
      });

      // 2. Transfer In
      const result = await this.processTransaction(session, {
        orgId, shopId: toShopId, productId, variantId,
        type: 'transfer_in', quantity, unitSymbol,
        referenceType: 'transfer', note, createdBy: userId
      });

      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get Current stock list
   */
  async getStockList(orgId, filter = {}, options = { skip: 0, limit: 20 }) {
    const query = { orgId, ...filter };
    const items = await Stock.find(query)
      .populate('productId', 'name sku brand')
      .populate('shopId', 'name')
      .skip(options.skip)
      .limit(options.limit)
      .lean();
    
    const count = await Stock.countDocuments(query);
    return { items, count, page: Math.floor(options.skip / options.limit) + 1 };
  }

  /**
   * Get Stock Ledger
   */
  async getStockLedger(orgId, filter = {}, options = { skip: 0, limit: 20 }) {
    const query = { orgId, ...filter };
    const items = await StockTransaction.find(query)
      .populate('productId', 'name sku')
      .populate('shopId', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .lean();
    
    const count = await StockTransaction.countDocuments(query);
    return { items, count, page: Math.floor(options.skip / options.limit) + 1 };
  }
}

module.exports = new StockService();
