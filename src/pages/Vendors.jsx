// src/pages/Vendors.jsx
import React, { useEffect, useState } from "react";
import apiService from "../api/api";
import { useArea } from "../context/AreaContext";
import "./css/Vendors.css";

function Vendors() {
  const { area } = useArea();
  const [vendors, setVendors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newVendor, setNewVendor] = useState({
    name: "",
    type: "",
    address: "",
    latitude: "",
    longitude: "",
    area: area || "",
    phone: "",
    is_open: true,
    prep_time: "",
    service_radius: "",
  });

  const [vendorImage, setVendorImage] = useState(null);

  // ✅ Fetch vendors for selected area
  const fetchVendors = async () => {
    if (!area) return;
    try {
      setLoading(true);
      const data = await apiService({
        url: `/api/vendors/vendorsByArea?area=${area}`,
        method: "GET",
      });
      setVendors(data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch areas for dropdown
  const fetchAreas = async () => {
    try {
      const data = await apiService({
        url: "/api/fetchServiceArea",
        method: "GET",
      });
      if (data && data.length > 0) {
        setAreas(data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch areas:", err.message);
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchVendors();
  }, [area]);

  // ✅ Handle vendor form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVendor((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image selection
  const handleFileChange = (e) => {
    setVendorImage(e.target.files[0]); // <-- This must be a File object
  };

  // ✅ Submit new vendor (multipart/form-data)
  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newVendor).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (vendorImage) {
        formData.append("image", vendorImage); // <-- Must append File object, not string
      }

      await apiService({
        url: "/api/vendors",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewVendor({
        name: "",
        type: "",
        address: "",
        latitude: "",
        longitude: "",
        area: area || "",
        phone: "",
        is_open: true,
        prep_time: "",
        service_radius: "",
      });
      setVendorImage(null);

      fetchVendors(); // refresh list
    } catch (err) {
      console.error("Error adding vendor:", err);
    }
  };

  return (
    <div className="vendors-container">
      <h2 className="page-title">Vendors for Area: {area}</h2>

      {/* Add Vendor Form */}
      <form onSubmit={handleAddVendor} className="vendor-form">
        <div className="form-row">
          <input
            name="name"
            value={newVendor.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <select
            name="type"
            value={newVendor.type}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="restaurant">Restaurant</option>
            <option value="grocery">Grocery</option>
            <option value="medicine">Medicine</option>
          </select>
          <input
            name="phone"
            value={newVendor.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
        </div>

        <div className="form-row">
          <input
            name="prep_time"
            type="number"
            value={newVendor.prep_time}
            onChange={handleChange}
            placeholder="Prep Time (mins)"
          />
          <input
            name="service_radius"
            value={newVendor.service_radius}
            onChange={handleChange}
            placeholder="Max Radius (km)"
          />
          <select
            name="area"
            value={newVendor.area}
            onChange={handleChange}
            required
          >
            {areas.map((p, idx) => (
              <option key={idx} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <input
            name="address"
            value={newVendor.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
          <input
            name="latitude"
            value={newVendor.latitude}
            onChange={handleChange}
            placeholder="Latitude"
          />
          <input
            name="longitude"
            value={newVendor.longitude}
            onChange={handleChange}
            placeholder="Longitude"
          />
        </div>

        <div className="form-row">
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* {vendorImage && (
            <img
              src={URL.createObjectURL(vendorImage)}
              alt="preview"
              style={{ width: "60px", height: "60px", marginLeft: "10px" }}
            />
          )} */}
        </div>

        <div className="form-row">
          <button type="submit" className="submit-btn">
            Add Vendor
          </button>
        </div>
      </form>

      {/* Vendor List */}
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
              <th>Area</th>
              <th>Prep Time</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.name}</td>
                <td>{v.type}</td>
                <td>{v.phone}</td>
                <td>{v.address}</td>
                <td>{v.service_area}</td>
                <td>{v.prep_time} min</td>
                <td>{v.is_open ? "✅" : "❌"}</td>
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
