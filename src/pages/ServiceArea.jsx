import React, { useEffect, useState } from "react";
import apiService from "../api/api";
import "./css/ServiceArea.css";

function ServiceArea() {
  const [areas, setAreas] = useState([]);
  const [newArea, setNewArea] = useState({ area: "", pincode: "" });
  const [search, setSearch] = useState("");

  // ✅ Fetch all service areas
  const fetchAreas = async () => {
    try {
      const data = await apiService({
        url: "/api/fetchServiceArea",
        method: "GET",
      });
      setAreas(data);
    } catch (err) {
      console.error("Error fetching service areas:", err);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewArea((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add new service area
  const handleAddArea = async (e) => {
    e.preventDefault();
    try {
      await apiService({
        url: "/api/addServiceArea",
        method: "POST",
        data: newArea,
      });

      setNewArea({ area: "", pincode: "" });
      fetchAreas();
    } catch (err) {
      console.error("Error adding service area:", err);
    }
  };

  const handleClear = () => {
    setNewArea({ area: "", pincode: "" });
  };

  // ✅ Filter search
  const filteredAreas = areas.filter(
    (item) =>
      item.area.toLowerCase().includes(search.toLowerCase()) ||
      item.pincode.includes(search)
  );

  return (
    <div className="servicearea-container">
      <h2 className="page-title">Service Areas</h2>

      {/* === Add New Service Area === */}
      <form onSubmit={handleAddArea} className="servicearea-form">
        <h3>Add Service Area</h3>
        <input
          name="area"
          value={newArea.area}
          onChange={handleChange}
          placeholder="Area"
          required
        />
        <input
          name="pincode"
          value={newArea.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          required
        />

        <div className="form-buttons">
          <button type="submit">Add</button>
          <button type="button" onClick={handleClear} className="clear-btn">
            Clear
          </button>
        </div>
      </form>

      {/* === Search === */}
      <h3>Currently Servicable Areas</h3>
      <input
        type="text"
        placeholder="Search by area or pincode..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* === Table === */}
      <table className="area-table">
        <thead>
          <tr>
            <th>Area</th>
            <th>Pincode</th>
          </tr>
        </thead>
        <tbody>
          {filteredAreas.length > 0 ? (
            filteredAreas.map((item) => (
              <tr key={item.id}>
                <td>{item.area}</td>
                <td>{item.pincode}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No areas found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceArea;
