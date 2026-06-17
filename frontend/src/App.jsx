import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";

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
        <button
          className="show-sidebar-btn"
          onClick={() => setSidebarOpen(true)}
          title="Show Menu"
        >
          ☰
        </button>
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
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}