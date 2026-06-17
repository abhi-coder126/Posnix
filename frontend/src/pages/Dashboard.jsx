import { useCallback, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import API from "../api/axios";
import { ToastViewport, useToast } from "../components/Toast";

const chartColors = ["#2563eb", "#16a34a", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("today");
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });
  const { toast, showToast } = useToast();

  const fetchDashboard = useCallback(async () => {
    try {
      let url = `/dashboard?filter=${filter}`;

      if (filter === "custom") {
        if (!dates.startDate || !dates.endDate) {
          return showToast("Start date and end date required", "warning");
        }

        url += `&startDate=${dates.startDate}&endDate=${dates.endDate}`;
      }

      const res = await API.get(url);
      setData(res.data);
    } catch (error) {
      showToast(error.response?.data?.message || "Dashboard fetch failed");
    }
  }, [dates.endDate, dates.startDate, filter, showToast]);

  useEffect(() => {
    if (filter !== "custom") {
      fetchDashboard();
    }
  }, [fetchDashboard, filter]);

  if (!data) return <h2>Loading Dashboard...</h2>;

  const s = data.stats || {};
  const c = data.charts || {};
  const n = data.notices || {};

  const cards = [
    ["Total Sale", s.totalSale],
    ["Total Invoices", s.totalInvoices, "count"],
    ["Total Return / Refund", s.totalReturnRefund],
    ["Cash In Hand Total", s.cashInHand],
    ["Total UPI Payment", s.totalUPI],
    ["Total Card Payment", s.totalCard],
    ["Partial Payment", s.partialPayment],
    ["Gross Sale", s.grossSale],
    ["Net Profit", s.netProfit],
    ["Gross Profit", s.grossProfit],
    ["Average Bill Value", s.averageBillValue],
    ["Available Stock Value", s.availableStockValue],
    ["Total Expired Items", s.totalExpiredItems, "count"],
    ["Total Customers", s.totalCustomers, "count"],
    ["Total Vendors", s.totalVendors, "count"],
  ];

  const topSellingItems = c.topSellingItems || [];
  const topPaymentMethod = c.topPaymentMethod || [];
  const peakHour = c.peakHour || [];
  const peakWeekend = c.peakWeekend || [];
  const totalSale = c.totalSale || [];

  const moneyFormatter = (value) => `₹${Number(value || 0).toFixed(2)}`;

  return (
    <div className="dashboard-page">
      <ToastViewport toast={toast} />
      <div className="dashboard-header">
        <div>
          <h1>Business Dashboard</h1>
          <p>Live sales, returns, payments, profit, stock alerts and billing performance overview</p>
        </div>
      </div>

      <div className="dashboard-filter-card">
        <input
          readOnly
          value={
            filter === "today"
              ? "Today"
              : filter === "yesterday"
              ? "Yesterday"
              : filter === "month"
              ? "This Month"
              : filter === "year"
              ? "This Year"
              : "Custom Date"
          }
        />

        <button
          className={filter === "today" ? "active" : ""}
          onClick={() => setFilter("today")}
        >
          Today
        </button>

        <button
          className={filter === "yesterday" ? "active" : ""}
          onClick={() => setFilter("yesterday")}
        >
          Yesterday
        </button>

        <button
          className={filter === "month" ? "active" : ""}
          onClick={() => setFilter("month")}
        >
          This Month
        </button>

        <button
          className={filter === "year" ? "active" : ""}
          onClick={() => setFilter("year")}
        >
          This Year
        </button>

        <button
          className={filter === "custom" ? "active" : ""}
          onClick={() => setFilter("custom")}
        >
          Custom Date
        </button>

        {filter === "custom" && (
          <>
            <input
              type="date"
              value={dates.startDate}
              onChange={(e) =>
                setDates({ ...dates, startDate: e.target.value })
              }
            />

            <input
              type="date"
              value={dates.endDate}
              onChange={(e) =>
                setDates({ ...dates, endDate: e.target.value })
              }
            />

            <button onClick={fetchDashboard}>Apply</button>
          </>
        )}
      </div>

      <div className="dashboard-stats-grid">
        {cards.map(([title, value, type], index) => (
          <div
            className={`dashboard-stat-card ${index < 4 ? "kpi-primary" : ""}`}
            key={index}
          >
            <span>{title}</span>
            <h2>
              {type === "count"
                ? Number(value || 0)
                : `₹${Number(value || 0).toFixed(2)}`}
            </h2>
          </div>
        ))}
      </div>

      <div className="dashboard-charts-grid">
        <div className="dashboard-chart-box">
          <h2>Top Selling Items</h2>

          {topSellingItems.length === 0 ? (
            <p>No data found</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topSellingItems} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip formatter={(value) => [`${value} Qty`, "Sold"]} />
                <Bar dataKey="qty" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="dashboard-chart-box">
          <h2>Top Payment Method</h2>

          {topPaymentMethod.length === 0 ? (
            <p>No data found</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={topPaymentMethod}
                    dataKey="amount"
                    nameKey="name"
                    outerRadius={82}
                    innerRadius={48}
                    paddingAngle={4}
                  >
                    {topPaymentMethod.map((_, index) => (
                      <Cell
                        key={index}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => moneyFormatter(value)} />
                </PieChart>
              </ResponsiveContainer>

              <div className="payment-method-list">
                {topPaymentMethod.map((item, index) => (
                  <div key={item.name || index}>
                    <span
                      style={{
                        backgroundColor: chartColors[index % chartColors.length],
                      }}
                    />
                    <b>{item.name}</b>
                    <strong>{moneyFormatter(item.amount)}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="dashboard-chart-box">
          <h2>Peak Hour</h2>

          {peakHour.length === 0 ? (
            <p>No data found</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={peakHour} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="peakHourGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip formatter={(value) => moneyFormatter(value)} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  fill="url(#peakHourGradient)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563eb" }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="dashboard-chart-box">
          <h2>Peak Weekend</h2>

          {peakWeekend.length === 0 ? (
            <p>No data found</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={peakWeekend} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip formatter={(value) => moneyFormatter(value)} />
                <Bar dataKey="amount" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="dashboard-charts-grid single">
        <div className="dashboard-chart-box total-sale-chart">
          <h2>Total Sale</h2>

          {totalSale.length === 0 ? (
            <p>No sale found</p>
          ) : (
            <ResponsiveContainer width="100%" height={330}>
              <LineChart data={totalSale.slice(0, 15)} margin={{ top: 10, right: 25, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="invoiceNo" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip formatter={(value) => moneyFormatter(value)} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#2563eb" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="important-notices">
        <h2>Important Notices</h2>

        <div className="notice-grid">
          <Notice
            title="Last Login Date / Time"
            value={n.lastLogin ? new Date(n.lastLogin).toLocaleString() : "N/A"}
          />

          <Notice
            title="Pending Vendor Payments"
            value={`₹${Number(n.vendorPendingPayments || 0).toFixed(2)}`}
          />

          <Notice
            title="Today’s Total Return / Refund"
            value={`₹${Number(n.todayReturnRefund || 0).toFixed(2)}`}
          />
        </div>

        <div className="notice-list-grid">
          <NoticeList title="Expired Item Name" items={n.expiredItems || []} />
          <NoticeList
            title="Out Of Stock Item Name"
            items={n.outOfStockItems || []}
          />
          <NoticeList title="Low Stock Items" items={n.lowStockItems || []} />
        </div>
      </div>
    </div>
  );
}

function Notice({ title, value }) {
  return (
    <div className="notice-card">
      <span>{title}</span>
      <b>{value}</b>
    </div>
  );
}

function NoticeList({ title, items }) {
  return (
    <div className="notice-list-card">
      <h3>{title}</h3>

      {items.length === 0 ? (
        <p>No item found</p>
      ) : (
        items.map((item) => (
          <p key={item._id}>
            {item.name} - Stock: {item.stock}
          </p>
        ))
      )}
    </div>
  );
}
