const Sale = require("../models/Sale");
const Product = require("../models/Product");
const SalesReturn = require("../models/SalesReturn");
const StockTransaction = require("../models/StockTransaction");

exports.getSalesReturns = async (req, res) => {
  try {
    const returns = await SalesReturn.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      returns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sales return fetch error",
      error: error.message,
    });
  }
};

exports.deleteSalesReturn = async (req, res) => {
  try {
    const salesReturn = await SalesReturn.findById(req.params.id);

    if (!salesReturn) {
      return res.status(404).json({
        success: false,
        message: "Sales return not found",
      });
    }

    for (const item of salesReturn.products || []) {
      if (!item.productId) continue;

      const product = await Product.findById(item.productId);

      if (product) {
        const before = Number(product.stock || 0);
        const qty = Number(item.qty || 0);
        const after = before - qty;

        if (after < 0) {
          return res.status(400).json({
            success: false,
            message: `${product.name} stock is not enough to reverse return`,
          });
        }

        product.stock = after;
        await product.save();

        await StockTransaction.create({
          productId: product._id,
          productName: product.name,
          barcode: product.barcode,
          type: "OUT",
          source: "SALE",
          sourceNo: salesReturn.returnNo || salesReturn.invoiceNo,
          qty,
          stockBefore: before,
          stockAfter: after,
          customerName: salesReturn.customerName,
        });
      }
    }

    await SalesReturn.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Sales return deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sales return delete error",
      error: error.message,
    });
  }
};