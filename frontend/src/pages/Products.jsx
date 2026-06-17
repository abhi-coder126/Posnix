import { useEffect, useState } from "react";
import API from "../api/axios";
import "../css/Products.css"
const emptyForm = {
  name: "",
  vendorId: "",
  vendorName: "",
  barcode: "",
  sku: "",
  category: "",
  unit: "PCS",
  purchasePrice: "",
  sellingPrice: "",
  mrp: "",
  gst: "",
  openingStock: "",
  lowStockLimit: 5,
  expiryDate: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchAll = async () => {
    const p = await API.get("/products");
    const v = await API.get("/vendors");

    setProducts(p.data.products || []);
    setSearchedProducts(p.data.products || []);
    setVendors(v.data.vendors || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSearch = () => {
    const q = search.toLowerCase().trim();

    if (!q) {
      setSearchedProducts(products);
      return;
    }

    setSearchedProducts(
      products.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.barcode?.toLowerCase().includes(q)
      )
    );
  };

  const submit = async (e) => {
    e.preventDefault();

    const vendor = vendors.find((v) => v._id === form.vendorId);

    await API.post("/products", {
      ...form,
      vendorName: vendor?.name || "",
    });

    setForm(emptyForm);
    setShowAdd(false);
    fetchAll();
  };

  const openEdit = (product) => {
    setSelectedProduct(product);

    setForm({
      name: product.name || "",
      vendorId: product.vendorId || "",
      vendorName: product.vendorName || "",
      barcode: product.barcode || "",
      sku: product.sku || "",
      category: product.category || "",
      unit: product.unit || "PCS",
      purchasePrice: product.purchasePrice || "",
      sellingPrice: product.sellingPrice || "",
      mrp: product.mrp || "",
      gst: product.gst || "",
      openingStock: product.stock || "",
      lowStockLimit: product.lowStockLimit || 5,
      expiryDate: product.expiryDate ? product.expiryDate.substring(0, 10) : "",
    });

    setShowEdit(true);
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    const vendor = vendors.find((v) => v._id === form.vendorId);

    await API.put(`/products/${selectedProduct._id}`, {
      ...form,
      vendorName: vendor?.name || form.vendorName,
      stock: selectedProduct.stock,
    });

    setShowEdit(false);
    setSelectedProduct(null);
    setForm(emptyForm);
    fetchAll();
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;

    const ok = window.confirm(
      `Are you sure you want to delete ${selectedProduct.name}?`
    );

    if (!ok) return;

    await API.delete(`/products/${selectedProduct._id}`);

    setShowInfo(false);
    setSelectedProduct(null);
    fetchAll();
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="products-page">
      <div className="products-head">
        <div>
          <h1>Products</h1>
          <p>Manage products, barcode, stock, GST and pricing</p>
        </div>
      </div>

      <div className="product-search-card">
        <input
          placeholder="Search by Product Name or Barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button onClick={handleSearch}>Search</button>

        <button
          className="add-product-main-btn"
          onClick={() => {
            setForm(emptyForm);
            setShowAdd(true);
          }}
        >
          + Add Product
        </button>
      </div>

      <div className="products-table-card">
        <h2>Product List</h2>

        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Barcode</th>
              <th>Available Stock</th>
              <th>Purchasing Price</th>
              <th>Selling Price</th>
              <th>MRP</th>
              <th>GST</th>
              <th>Info</th>
              <th>Edit</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {searchedProducts.length === 0 ? (
              <tr>
                <td colSpan="10">No product found</td>
              </tr>
            ) : (
              searchedProducts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <b>{p.name}</b>
                    <small>{p.category || "No Category"}</small>
                  </td>
                  <td>{p.barcode}</td>
                  <td>
                    <span
                      className={
                        Number(p.stock) <= Number(p.lowStockLimit || 0)
                          ? "stock-low"
                          : "stock-ok"
                      }
                    >
                      {p.stock} {p.unit}
                    </span>
                  </td>
                  <td>₹{p.purchasePrice}</td>
                  <td>₹{p.sellingPrice}</td>
                  <td>₹{p.mrp}</td>
                  <td>{p.gst}%</td>
                  <td>
                    <button
                      className="icon-info"
                      onClick={() => {
                        setSelectedProduct(p);
                        setShowInfo(true);
                      }}
                    >
                      i
                    </button>
                  </td>
                  <td>
                    <button className="icon-edit" onClick={() => openEdit(p)}>
                      ✎
                    </button>
                  </td>
                  <td>
                    <button
                      className="icon-view"
                      onClick={() => {
                        setSelectedProduct(p);
                        setShowView(true);
                      }}
                    >
                      👁
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <ProductModal title="Add Product" close={() => setShowAdd(false)}>
          <ProductForm
            form={form}
            setForm={setForm}
            vendors={vendors}
            submit={submit}
            buttonText="Save Product"
            hideStock={false}
          />
        </ProductModal>
      )}

      {showEdit && (
        <ProductModal title="Edit Product" close={() => setShowEdit(false)}>
          <ProductForm
            form={form}
            setForm={setForm}
            vendors={vendors}
            submit={updateProduct}
            buttonText="Update Product"
            hideStock={true}
          />
        </ProductModal>
      )}

      {showInfo && selectedProduct && (
        <ProductModal title="Product Info" close={() => setShowInfo(false)}>
          <div className="product-info-box">
            <h3>{selectedProduct.name}</h3>
            <p>Barcode: {selectedProduct.barcode}</p>
            <p>Vendor: {selectedProduct.vendorName || "N/A"}</p>
            <p>
              Stock: {selectedProduct.stock} {selectedProduct.unit}
            </p>
            <p>Last Updated: {formatDateTime(selectedProduct.updatedAt)}</p>

            <button className="delete-product-btn" onClick={deleteProduct}>
              Delete Product
            </button>
          </div>
        </ProductModal>
      )}

      {showView && selectedProduct && (
        <ProductModal title="Product Details" close={() => setShowView(false)}>
          <div className="product-view-grid">
            <Info label="Product Name" value={selectedProduct.name} />
            <Info label="Vendor" value={selectedProduct.vendorName || "N/A"} />
            <Info label="Barcode" value={selectedProduct.barcode} />
            <Info label="SKU" value={selectedProduct.sku || "N/A"} />
            <Info label="Category" value={selectedProduct.category || "N/A"} />
            <Info
              label="Available Stock"
              value={`${selectedProduct.stock} ${selectedProduct.unit}`}
            />
            <Info label="Purchase Price" value={`₹${selectedProduct.purchasePrice}`} />
            <Info label="Selling Price" value={`₹${selectedProduct.sellingPrice}`} />
            <Info label="MRP" value={`₹${selectedProduct.mrp}`} />
            <Info label="GST" value={`${selectedProduct.gst}%`} />
            <Info label="Low Stock Limit" value={selectedProduct.lowStockLimit} />
            <Info label="Created Date" value={formatDateTime(selectedProduct.createdAt)} />
            <Info label="Last Updated" value={formatDateTime(selectedProduct.updatedAt)} />
          </div>
        </ProductModal>
      )}
    </div>
  );
}

function ProductModal({ title, close, children }) {
  return (
    <div className="product-modal-overlay">
      <div className="product-modal">
        <div className="product-modal-head">
          <h2>{title}</h2>
          <button onClick={close}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function ProductForm({ form, setForm, vendors, submit, buttonText, hideStock }) {
  return (
    <form className="product-form-grid" onSubmit={submit}>
      <input
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <select
        value={form.vendorId}
        onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
        required
      >
        <option value="">Select Vendor</option>
        {vendors.map((v) => (
          <option key={v._id} value={v._id}>
            {v.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Barcode"
        value={form.barcode}
        onChange={(e) => setForm({ ...form, barcode: e.target.value })}
        required
      />

      <input
        placeholder="SKU"
        value={form.sku}
        onChange={(e) => setForm({ ...form, sku: e.target.value })}
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <select
        value={form.unit}
        onChange={(e) => setForm({ ...form, unit: e.target.value })}
      >
        <option>PCS</option>
        <option>Box</option>
        <option>KG</option>
        <option>Litre</option>
      </select>

      <input
        type="number"
        placeholder="Purchase Price"
        value={form.purchasePrice}
        onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Selling Price"
        value={form.sellingPrice}
        onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="MRP"
        value={form.mrp}
        onChange={(e) => setForm({ ...form, mrp: e.target.value })}
      />

      <input
        type="number"
        placeholder="GST %"
        value={form.gst}
        onChange={(e) => setForm({ ...form, gst: e.target.value })}
      />

      {!hideStock && (
        <input
          type="number"
          placeholder="Opening Stock"
          value={form.openingStock}
          onChange={(e) => setForm({ ...form, openingStock: e.target.value })}
        />
      )}

      <input
        type="number"
        placeholder="Low Stock Limit"
        value={form.lowStockLimit}
        onChange={(e) => setForm({ ...form, lowStockLimit: e.target.value })}
      />

      <input
        type="date"
        value={form.expiryDate}
        onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
      />

      <button>{buttonText}</button>
    </form>
  );
}