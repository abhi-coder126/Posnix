import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AllProducts() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="products-table-card">
      <h1>View All Products</h1>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Barcode</th>
            <th>HSN</th>
            <th>Purchase</th>
            <th>Sale</th>
            <th>GST</th>
            <th>Stock</th>
            <th>Vendor</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8">No product found</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.productName}</td>
                <td>{product.skuBarcode}</td>
                <td>{product.hsnSacCode}</td>
                <td>₹{product.purchasePrice}</td>
                <td>₹{product.priceRate}</td>
                <td>{product.taxRate}%</td>
                <td>
                  {product.availableStock} {product.unit}
                </td>
                <td>{product.vendor?.vendorName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}