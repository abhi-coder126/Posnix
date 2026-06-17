const express = require("express");
const router = express.Router();

const {
  createSale,
  getSales,
  getLatestSale,
  deleteSale,
} = require("../controllers/saleController");

router.post("/", createSale);
router.get("/", getSales);
router.get("/latest", getLatestSale);
router.delete("/:id", deleteSale);

module.exports = router;