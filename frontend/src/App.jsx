import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import { ToastViewport, useToast } from "./components/Toast";

import Dashboard from "./pages/Dashboard";
import BillingPOS from "./pages/BillingPOS";
import Products from "./pages/Products";
import AllProducts from "./pages/AllProducts";
import Purchase from "./pages/Purchase";
import GRNManagement from "./pages/GRNManagement";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Vendors from "./pages/Vendors";
import SalesReturn from "./pages/SalesReturn";
import Settings from "./pages/Settings";
import Coupons from "./pages/Coupons";
import Accounts from "./pages/Accounts";
import SupplierBills from "./pages/SupplierBills";
import Login from "./pages/Login";

const pageMeta = {
  "/": {
    title: "Dashboard | Posnix Billing Software",
    description: "Complete overview of sales, payments, returns, stock alerts and business performance.",
  },
  "/billing": {
    title: "Billing / POS | Posnix Billing Software",
    description: "Fast billing counter for product scanning, customer billing, discounts, payments and invoice printing.",
  },
  "/products": {
    title: "Products | Posnix Billing Software",
    description: "Create and manage products with barcode, category, pricing, GST and stock settings.",
  },
  "/all-products": {
    title: "Inventory | Posnix Billing Software",
    description: "Track live stock, low stock items, purchase cost, selling price, category and vendor details.",
  },
  "/purchase": {
    title: "Purchase / GRN | Posnix Billing Software",
    description: "Receive vendor stock, create purchase bills, update product cost and manage GRN payments.",
  },
  "/grn-management": {
    title: "GRN Management | Posnix Billing Software",
    description: "Review, search and update goods received notes, purchase quantities, pricing and payment records.",
  },
  "/supplier-bills": {
    title: "Supplier Bills | Posnix Billing Software",
    description: "View supplier invoices, GRN totals, paid amounts, pending balances and payment status.",
  },
  "/sales-return": {
    title: "Sales Return / Refund | Posnix Billing Software",
    description: "Manage invoice returns, returned products, refund amounts and stock reversal records.",
  },
  "/reports": {
    title: "Sales Reports | Posnix Billing Software",
    description: "Search and review invoices, customers, payment modes, sale totals and billing history.",
  },
  "/customers": {
    title: "Customers | Posnix Billing Software",
    description: "Manage customer profiles, CRN records, contact details, address and purchase history.",
  },
  "/vendors": {
    title: "Vendors | Posnix Billing Software",
    description: "Manage supplier profiles, GST details, opening balance, purchases and outstanding payments.",
  },
  "/accounts": {
    title: "Accounts | Posnix Billing Software",
    description: "Track vendor pending payments, payment history and supplier account balances.",
  },
  "/coupons": {
    title: "Coupons | Posnix Billing Software",
    description: "Create, control and manage billing discount coupons for customer invoices.",
  },
  "/settings": {
    title: "Settings | Posnix Billing Software",
    description: "Configure store details, invoice printing, payment modes, policies and system preferences.",
  },
  "/login": {
    title: "Login | Posnix Billing Software",
    description: "Secure login for Posnix billing, inventory, purchase and POS management.",
  },
};

function PageMeta() {
  const location = useLocation();

  useEffect(() => {
    const meta = pageMeta[location.pathname] || pageMeta["/"];
    document.title = meta.title;

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }

    description.setAttribute("content", meta.description);
  }, [location.pathname]);

  return null;
}

function ProtectedLayout() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!token) return <Navigate to="/login" replace />;

  const isBillingPage = location.pathname === "/billing";

  return (
    <div className={`app-layout ${!sidebarOpen || isBillingPage ? "sidebar-closed" : ""}`}>
      {!isBillingPage && sidebarOpen && (
        <Sidebar onClose={() => setSidebarOpen(false)} />
      )}

      {!isBillingPage && !sidebarOpen && (
        <aside className="sidebar-mini">
          <button
            className="show-sidebar-btn"
            onClick={() => setSidebarOpen(true)}
            title="Show Menu"
          >
            <Menu size={24} />
          </button>
        </aside>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/billing" element={<BillingPOS />} />
          <Route path="/products" element={<Products />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/grn-management" element={<GRNManagement />} />
          <Route path="/supplier-bills" element={<SupplierBills />} />
          <Route path="/sales-return" element={<SalesReturn />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { toast, showToast } = useToast();

  useEffect(() => {
    const nativeAlert = window.alert;
    window.alert = (message) => showToast(String(message || ""), "info");
    return () => {
      window.alert = nativeAlert;
    };
  }, [showToast]);

  return (
    <>
      <PageMeta />
      <ToastViewport toast={toast} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </>
  );
}
