import { useEffect, useState } from "react";
import API from "../api/axios";

const defaultSettings = {
  storeName: "",
  storeShortName: "POS",
  storeAddress: "",
  gstNumber: "",
  storeContact: "",
  storeEmail: "",
  logo: "",

  invoicePrefix: "INV",
  invoicePrintSize: "80MM",

  thankYouMessage: "Thank you for shopping!",
  termsAndConditions: "",
  returnPolicy: "",

  showStoreDetails: true,
  showGSTDetails: true,
  showCustomerDetails: true,
  showTerms: true,
  showReturnPolicy: true,
  showThankYou: true,
  qrCodeEnabled: true,

  cashEnabled: true,
  upiEnabled: true,
  cardEnabled: true,
  partialPaymentEnabled: true,
  bankTransferEnabled: false,

  lowStockAlertQty: 5,
  expiryAlertDays: 30,
  themeMode: "light",
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await API.get("/settings");
      setSettings({ ...defaultSettings, ...(res.data.settings || {}) });
    } catch (error) {
      alert(error.response?.data?.message || "Settings fetch failed");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const change = (key, value) => {
      setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      await API.put("/settings", settings);
      alert("Settings saved successfully");
      fetchSettings();
    } catch (error) {
      alert(error.response?.data?.message || "Settings save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-head">
        <div>
          <h1>System Settings</h1>
          <p>Configure store details, invoice policies, payment modes and system preferences</p>
        </div>

        <button onClick={saveSettings} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="settings-section">
        <h2>Store Settings</h2>

        <div className="settings-form-grid">
          <input
            placeholder="Store Name"
            value={settings.storeName}
            onChange={(e) => change("storeName", e.target.value)}
          />

          <input
            placeholder="Store Short Name"
            value={settings.storeShortName}
            onChange={(e) => change("storeShortName", e.target.value)}
          />

          <input
            placeholder="GST Number"
            value={settings.gstNumber}
            onChange={(e) => change("gstNumber", e.target.value)}
          />

          <input
            placeholder="Store Contact"
            value={settings.storeContact}
            onChange={(e) => change("storeContact", e.target.value)}
          />

          <input
            placeholder="Store Email"
            value={settings.storeEmail}
            onChange={(e) => change("storeEmail", e.target.value)}
          />

          <input
            placeholder="Logo URL"
            value={settings.logo}
            onChange={(e) => change("logo", e.target.value)}
          />

          <textarea
            placeholder="Store Address"
            value={settings.storeAddress}
            onChange={(e) => change("storeAddress", e.target.value)}
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Invoice Settings</h2>

        <div className="settings-form-grid">
          <input
            placeholder="Invoice Prefix"
            value={settings.invoicePrefix}
            onChange={(e) => change("invoicePrefix", e.target.value)}
          />

          <select
            value={settings.invoicePrintSize}
            onChange={(e) => change("invoicePrintSize", e.target.value)}
          >
            <option value="58MM">58MM</option>
            <option value="80MM">80MM</option>
            <option value="A4">A4</option>
          </select>

          <textarea
            placeholder="Thank You Message"
            value={settings.thankYouMessage}
            onChange={(e) => change("thankYouMessage", e.target.value)}
          />

          <textarea
            placeholder="Terms And Conditions"
            value={settings.termsAndConditions}
            onChange={(e) => change("termsAndConditions", e.target.value)}
          />

          <textarea
            placeholder="Return Policy"
            value={settings.returnPolicy}
            onChange={(e) => change("returnPolicy", e.target.value)}
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Show / Hide Invoice Data</h2>

        <div className="settings-grid">
          <Toggle title="Store Details" value={settings.showStoreDetails} onClick={() => change("showStoreDetails", !settings.showStoreDetails)} />
          <Toggle title="GST Details" value={settings.showGSTDetails} onClick={() => change("showGSTDetails", !settings.showGSTDetails)} />
          <Toggle title="Customer Details" value={settings.showCustomerDetails} onClick={() => change("showCustomerDetails", !settings.showCustomerDetails)} />
          <Toggle title="Terms" value={settings.showTerms} onClick={() => change("showTerms", !settings.showTerms)} />
          <Toggle title="Return Policy" value={settings.showReturnPolicy} onClick={() => change("showReturnPolicy", !settings.showReturnPolicy)} />
          <Toggle title="Thank You Message" value={settings.showThankYou} onClick={() => change("showThankYou", !settings.showThankYou)} />
          <Toggle title="QR Code" value={settings.qrCodeEnabled} onClick={() => change("qrCodeEnabled", !settings.qrCodeEnabled)} />
        </div>
      </div>

      <div className="settings-section">
        <h2>Payment Modes</h2>

        <div className="settings-grid">
          <Toggle title="Cash" value={settings.cashEnabled} onClick={() => change("cashEnabled", !settings.cashEnabled)} />
          <Toggle title="UPI" value={settings.upiEnabled} onClick={() => change("upiEnabled", !settings.upiEnabled)} />
          <Toggle title="Card" value={settings.cardEnabled} onClick={() => change("cardEnabled", !settings.cardEnabled)} />
          <Toggle title="Partial Payment" value={settings.partialPaymentEnabled} onClick={() => change("partialPaymentEnabled", !settings.partialPaymentEnabled)} />
          <Toggle title="Bank Transfer" value={settings.bankTransferEnabled} onClick={() => change("bankTransferEnabled", !settings.bankTransferEnabled)} />
        </div>
      </div>

      <div className="settings-section">
        <h2>General System Settings</h2>

        <div className="settings-form-grid">
          <input
            type="number"
            placeholder="Low Stock Alert Qty"
            value={settings.lowStockAlertQty}
            onChange={(e) => change("lowStockAlertQty", e.target.value)}
          />

          <input
            type="number"
            placeholder="Expiry Alert Days"
            value={settings.expiryAlertDays}
            onChange={(e) => change("expiryAlertDays", e.target.value)}
          />

          <select
            value={settings.themeMode}
            onChange={(e) => change("themeMode", e.target.value)}
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Toggle({ title, value, onClick }) {
  return (
    <div className="settings-card">
      <h3>{title}</h3>
      <button className={`switch-btn ${value ? "active" : ""}`} onClick={onClick}>
        <span></span>
      </button>
    </div>
  );
}
