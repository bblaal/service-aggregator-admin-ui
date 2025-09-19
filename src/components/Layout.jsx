import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useArea } from "../context/AreaContext";
import AreaModal from "./AreaModal";
import "./css/Layout.css";

const Layout = () => {
  const { area } = useArea();
  const [showAreaModal, setShowAreaModal] = React.useState(false);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/service-area">Service Area</Link></li>
            <li><Link to="/global-menu">Global Menu</Link></li>
            <li><Link to="/vendors">Vendors</Link></li>
            <li><Link to="/delivery-agents">Delivery Agents</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
        <div className="current-area">
          📍 Current Area: <span>{area || "Not Selected"}</span>
        </div>
          <button onClick={() => setShowAreaModal(true)}>
            Change Area
          </button>
        </header>
        <section className="content">
          <Outlet /> {/* ✅ this will render Dashboard/Orders/etc */}
        </section>
      </main>

      {showAreaModal && (
        <AreaModal onClose={() => setShowAreaModal(false)} />
      )}
    </div>
  );
};

export default Layout;
