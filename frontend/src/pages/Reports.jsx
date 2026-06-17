import { useEffect, useState } from "react";
import API from "../api/axios";
import "../css/Report.css";

export default function Reports() {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const fetchReports = async () => {
    const saleRes = await API.get("/sales");
    setSales(saleRes.data.sales || []);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const deleteInvoice = async () => {
    if (!selectedSale) return;

    const ok = window.confirm(
      `Are you sure you want to delete invoice ${selectedSale.invoiceNo}?`
    );

    if (!ok) return;

    try {
      await API.delete(`/sales/${selectedSale._id}`);
      alert("Invoice deleted successfully");

      setShowInfo(false);
      setSelectedSale(null);
      fetchReports();
    } catch (error) {
      alert(error.response?.data?.message || "Invoice delete failed");
    }
  };

  return (
    <div className="reports-page">
      <div className="page-head">
        <div>
          <h1>Sales Report</h1>
          <p>Invoice, customer, payment and sales records</p>
        </div>
      </div>

      <div className="panel">
        <h2>Sales Invoices</h2>

        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Cash</th>
              <th>Card</th>
              <th>UPI</th>
              <th>Credit</th>
              <th>Total</th>
              <th>Info</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="9">No sales found</td>
              </tr>
            ) : (
              sales.map((s) => (
                <tr key={s._id}>
                  <td>{s.invoiceNo}</td>
                  <td>{formatDate(s.createdAt)}</td>
                  <td>{s.customerName}</td>
                  <td>₹{s.payment?.cash || 0}</td>
                  <td>₹{s.payment?.card || 0}</td>
                  <td>₹{s.payment?.upi || 0}</td>
                  <td>₹{s.payment?.credit || 0}</td>
                  <td>₹{s.grandTotal}</td>
                  <td>
                    <button
                      className="report-info-btn"
                      onClick={() => {
                        setSelectedSale(s);
                        setShowInfo(true);
                      }}
                    >
                      i
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showInfo && selectedSale && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <div className="report-modal-head">
              <h2>Invoice Details</h2>
              <button onClick={() => setShowInfo(false)}>×</button>
            </div>

            <div className="report-info-grid">
              <div>
                <span>Invoice No</span>
                <b>{selectedSale.invoiceNo}</b>
              </div>

              <div>
                <span>Date</span>
                <b>{formatDate(selectedSale.createdAt)}</b>
              </div>

              <div>
                <span>Customer</span>
                <b>{selectedSale.customerName}</b>
              </div>

              <div>
                <span>Mobile</span>
                <b>{selectedSale.customerPhone}</b>
              </div>

              <div>
                <span>Grand Total</span>
                <b>₹{selectedSale.grandTotal}</b>
              </div>

              <div>
                <span>Payment Status</span>
                <b>{selectedSale.paymentStatus}</b>
              </div>
            </div>

            <h3>Products</h3>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Barcode</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>GST</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {selectedSale.products?.map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>{p.barcode}</td>
                    <td>{p.qty}</td>
                    <td>₹{p.rate}</td>
                    <td>{p.gst}%</td>
                    <td>₹{p.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="delete-invoice-btn" onClick={deleteInvoice}>
              Delete Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}