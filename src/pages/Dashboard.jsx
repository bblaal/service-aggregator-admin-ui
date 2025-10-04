import React, { useEffect, useState } from "react";
import apiService from "../api/api";
import { useArea } from "../context/AreaContext";
import "./css/Dashboard.css";

function Dashboard() {
  const { area } = useArea();
  const [vendors, setVendors] = useState([]);
  const [agents, setAgents] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock order stats
  const [orders, setOrders] = useState({
    today: 18,
    pending: 6,
    delivered: 12,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const areasData = await apiService({
        url: "/api/fetchServiceArea",
        method: "GET",
      });
      setAreas(areasData.map(item => item.area) || []);

      const vendorsData = await apiService({
        url: "/api/vendors/vendorsByArea?area=" + (area || "") + "&status=APPROVED",
        method: "GET",
      });
      setVendors(vendorsData || []);

      const agentsData = await apiService({
        url: "/api/delivery/agentsByArea?area=" + (area || ""),
        method: "GET",
      });
      setAgents(agentsData || []);

    } catch (err) {
      console.error("Dashboard fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Admin Dashboard</h2>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="card">
              <h3>{vendors.length}</h3>
              <p>Vendors</p>
            </div>
            <div className="card">
              <h3>{agents.length}</h3>
              <p>Delivery Agents</p>
            </div>
            <div className="card">
              <h3>{areas.length}</h3>
              <p>Service Areas</p>
            </div>
            <div className="card">
              <h3>{orders.today}</h3>
              <p>Orders Today</p>
            </div>
          </div>

          {/* Orders Summary */}
          <div className="orders-summary">
            <h3>📦 Orders Overview</h3>
            <div className="order-boxes">
              <div className="order-box pending">
                <h4>{orders.pending}</h4>
                <p>Pending</p>
              </div>
              <div className="order-box delivered">
                <h4>{orders.delivered}</h4>
                <p>Delivered</p>
              </div>
            </div>
          </div>

          {/* Quick Table Preview */}
          <div className="table-section">
            <h3>👨‍🍳 Vendors Preview</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {vendors.slice(0, 5).map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.name}</td>
                    <td>{v.type}</td>
                    <td>{v.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
