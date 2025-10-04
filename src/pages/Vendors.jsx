// src/pages/Vendors.jsx
import React, { useEffect, useState } from "react";
import apiService from "../api/api";
import { useArea } from "../context/AreaContext";
import "./css/Vendors.css";

function Vendors() {
  const { area } = useArea();
  const [vendors, setVendors] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  // const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [editingId, setEditingId] = useState(null);
  const [editVendor, setEditVendor] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Fetch all vendors for selected area
  const fetchVendors = async () => {
    if (!area) return;
    try {
      setLoading(true);
      const data = await apiService({
        url: `/api/vendors/vendorsByArea?area=${area}&status=APPROVED`,
        method: "GET",
      });
      setVendors(data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch pending vendors
  const fetchPendingVendors = async () => {
    if (!area) return;
    try {
      const data = await apiService({
        url: `/api/vendors/vendorsByArea?area=${area}&status=PENDING`,
        method: "GET",
      });
      setPendingVendors(data);
    } catch (err) {
      console.error("Error fetching pending vendors:", err);
    }
  };

  // ✅ Fetch areas
  // const fetchAreas = async () => {
  //   try {
  //     const data = await apiService({
  //       url: "/api/fetchServiceArea",
  //       method: "GET",
  //     });
  //     // if (data && data.length > 0) {
  //       // setAreas(data.map(item => item.area));
  //     // }
  //   } catch (err) {
  //     console.error("❌ Failed to fetch areas:", err.message);
  //   }
  // };

  useEffect(() => {
    // fetchAreas();
    fetchVendors();
    fetchPendingVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area]);

  // ✅ Handle input changes in popup or inline edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditVendor(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Service radius controls
  const increaseRadius = () => {
    setEditVendor(prev => ({
      ...prev,
      service_radius: Number(prev.service_radius || 0) + 1,
    }));
  };

  const decreaseRadius = () => {
    setEditVendor(prev => ({
      ...prev,
      service_radius: Math.max(Number(prev.service_radius || 0) - 1, 0),
    }));
  };

  // ✅ Approval toggle
  const toggleApproval = (status) => {
    setEditVendor(prev => ({ ...prev, status: status.toUpperCase() }));
  };

  // ✅ Submit pending vendor update or inline edit
  const handleSubmitSetup = async (id) => {
    try {
      await apiService({
        url: "/api/approve/vendor",
        method: "PATCH",
        data: editVendor,
        headers: { "Content-Type": "application/json" },
      });
      fetchVendors();
      fetchPendingVendors();
      setShowPopup(false);
      setEditVendor({});
      // setEditingId(null);
    } catch (err) {
      console.error("Error updating vendor setup:", err);
    }
  };

  // ✅ View pending vendor details popup
  const handleViewDetails = (vendor) => {
    // setEditingId(vendor.id);
    setEditVendor({ ...vendor });
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // setEditingId(null);
    setEditVendor({});
  };

  return (
    <div className="vendors-container">
      <h2 className="page-title">Pending Vendors for Area: {area}</h2>

      {/* Pending Vendors Section */}
      {pendingVendors.length > 0 ? (
        <table className="vendor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingVendors.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.name}</td>
                <td>{v.type}</td>
                <td>{v.phone}</td>
                <td>{v.address}</td>
                <td>
                  <button onClick={() => handleViewDetails(v)} className="action-btn edit">
                    View
                  </button>
                  {/* <button onClick={() => handleDeleteVendor(v.id)} className="action-btn delete">
                    <FaTrash /> Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending vendors found for this area.</p>
      )}

      {/* Popup for pending vendor */}
      {showPopup && (
        <div className="vendor-popup">
          <div className="popup-content">
            <h3>Vendor Details</h3>
            <div className="popup-row"><label>Type:</label><span>{editVendor.type.toUpperCase()}</span></div>
            <div className="popup-row"><label>Name:</label><span>{editVendor.name}</span></div>
            <div className="popup-row"><label>Phone:</label><span>{editVendor.phone}</span></div>
            <div className="popup-row"><label>Lic No:</label><span>{editVendor.fssai_lic}</span></div>
            <div className="popup-row"><label>Address:</label><span>{editVendor.address}</span></div>
            <div className="popup-row"><label>Location (Latitude + Longitude):</label><span>{editVendor.latitude + " + " + editVendor.longitude}</span></div>
            <div className="popup-row"><label>Prep Time:</label><span>{editVendor.prep_time} min</span></div>
            <div className="popup-row"><label>Status:</label><span>{editVendor.status}</span></div>
            <div className="popup-row"><label>Completed All Details:</label><span>{editVendor.full_details_completed ? "YES" : editVendor.basic_details_completed ? "PARTIAL" : "NO"}</span></div>
            <div className="popup-row">
              <label>Service Radius (km):</label>
              <div>
                <button onClick={decreaseRadius}>-</button>
                <input
                  type="number"
                  name="service_radius"
                  value={editVendor.service_radius || 0}
                  onChange={handleEditChange}
                  style={{ width: "60px", textAlign: "center" }}
                />
                <button onClick={increaseRadius}>+</button>
              </div>
            </div>
            <div className="popup-row">
              <label>Approval:</label>
              <button
                onClick={() => toggleApproval("APPROVED")}
                className={editVendor.status === "APPROVED" ? "active" : ""}
              >
                Approve
              </button>
              <button
                onClick={() => toggleApproval("REJECTED")}
                className={editVendor.status === "REJECTED" ? "active" : ""}
              >
                Reject
              </button>
            </div>
            <div className="popup-actions">
              <button onClick={() => handleSubmitSetup(editVendor.id)} className="submit-btn">Submit</button>
              <button onClick={handleClosePopup} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* All Vendors List Section */}
      <h2 className="page-title">All Vendors for Area: {area}</h2>
      {loading ? (
        <p>Loading vendors...</p>
      ) : vendors.length > 0 ? (
        <table className="vendor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.name}</td>
                <td>{v.type}</td>
                <td>{v.phone}</td>
                <td>{v.address}</td>
                <td>
                  <button onClick={() => handleViewDetails(v)} className="action-btn edit">
                    View
                  </button>
                  {/* <button onClick={() => handleDeleteVendor(v.id)} className="action-btn delete">
                    <FaTrash /> Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No vendors found for this area.</p>
      )}
    </div>
  );
}

export default Vendors;
