import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  ReceiptText,
  RotateCcw,
  Settings,
  Boxes,
  ClipboardList,
  BadgePercent,
  WalletCards,
  FileText,
  LogOut,
} from "lucide-react";

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/billing", label: "Billing / POS", icon: ShoppingCart },
    { to: "/products", label: "Products", icon: Package },
    { to: "/all-products", label: "Inventory", icon: Boxes },
    { to: "/purchase", label: "Purchase / GRN", icon: ClipboardList },
    { to: "/grn-management", label: "GRN Management", icon: ReceiptText },
    { to: "/supplier-bills", label: "Supplier Bills", icon: FileText },
    { to: "/sales-return", label: "Sales Return", icon: RotateCcw },
    { to: "/reports", label: "Reports", icon: ReceiptText },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/vendors", label: "Vendors", icon: Truck },
    { to: "/accounts", label: "Accounts", icon: WalletCards },
    { to: "/coupons", label: "Coupons", icon: BadgePercent },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
  <img
    src="/Posnix_Logo.png"
    alt="Posnix"
    className="sidebar-logo"
  />
</div>

        <button className="sidebar-toggle-btn" onClick={onClose} title="Hide Menu">
          <Menu size={22} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <button className="sidebar-logout" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
