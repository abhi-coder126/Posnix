const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    vendorName: String,

    barcode: { type: String, required: true },
    sku: String,
    category: String,

    unit: {
      type: String,
      enum: ["PCS", "Box", "KG", "Litre"],
      default: "PCS",
    },

    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    mrp: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },

    openingStock: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    lowStockLimit: { type: Number, default: 5 },

    expiryDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);