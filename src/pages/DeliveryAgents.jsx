import React, { useEffect, useState } from "react";
import apiService from "../api/api";
import { useArea } from "../context/AreaContext";
import "./css/DeliveryAgents.css";

function DeliveryAgents() {
  const { area } = useArea();
  const [agents, setAgents] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newAgent, setNewAgent] = useState({
    name: "",
    age: "",
    address: "",
    mobile: "",
    blood_group: "",
    license_no: "",
    bike_no: "",
    area: area || "",
  });

  const [agentImage, setAgentImage] = useState(null);

  // ✅ Fetch agents
  const fetchAgents = async () => {
    if (!area) return;
    try {
      setLoading(true);
      const data = await apiService({
        url: `/api/delivery/agentsByArea?area=${area}`,
        method: "GET",
      });
      setAgents(data);
    } catch (err) {
      console.error("Error fetching agents:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch areas
  const fetchAreas = async () => {
    try {
      const data = await apiService({
        url: "/api/fetchServiceArea",
        method: "GET",
      });
      if (data && data.length > 0) {
        setAreas(data.map(item => item.area));
      }
    } catch (err) {
      console.error("❌ Failed to fetch areas:", err.message);
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchAgents();
  }, [area]);

  // ✅ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAgent((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle file select
  const handleFileChange = (e) => {
    setAgentImage(e.target.files[0]);
  };

  // ✅ Submit new agent
  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newAgent).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (agentImage) {
        formData.append("image", agentImage);
      }

      await apiService({
        url: "/api/delivery/agents",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewAgent({
        name: "",
        age: "",
        address: "",
        mobile: "",
        blood_group: "",
        license_no: "",
        bike_no: "",
        area: area || "",
      });
      setAgentImage(null);

      fetchAgents(); // refresh
    } catch (err) {
      console.error("Error adding agent:", err);
    }
  };

  // ✅ Filter agents by search
  const filteredAgents = agents.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="agents-container">
      <h2 className="page-title">Delivery Agents for Area: {area}</h2>

      {/* Add Agent Form */}
      <form onSubmit={handleAddAgent} className="agent-form">
        <div className="form-row">
          <input
            name="name"
            value={newAgent.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            name="age"
            type="number"
            value={newAgent.age}
            onChange={handleChange}
            placeholder="Age"
          />
          <input
            name="mobile"
            value={newAgent.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            required
          />
        </div>

        <div className="form-row">
          <input
            name="blood_group"
            value={newAgent.blood_group}
            onChange={handleChange}
            placeholder="Blood Group"
          />
          <input
            name="license_no"
            value={newAgent.license_no}
            onChange={handleChange}
            placeholder="License Number"
          />
          <input
            name="bike_no"
            value={newAgent.bike_no}
            onChange={handleChange}
            placeholder="Bike Number"
          />
        </div>

        <div className="form-row">
          <input
            name="address"
            value={newAgent.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
          <select
            name="area"
            value={newAgent.area}
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
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-row">
          <button type="submit" className="submit-btn">
            Add Agent
          </button>
        </div>
      </form>

      {/* Search bar */}
      <div className="search-row">
        <input
          type="text"
          placeholder="Search agents by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Agent List */}
      {loading ? (
        <p>Loading agents...</p>
      ) : filteredAgents.length > 0 ? (
        <table className="agent-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Age</th>
              <th>Address</th>
              <th>Mobile</th>
              <th>Blood Group</th>
              <th>License No</th>
              <th>Bike No</th>
              <th>Area</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>
                  {a.image_url ? (
                    <img
                      src={a.image_url}
                      alt={a.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>{a.age}</td>
                <td>{a.address}</td>
                <td>{a.mobile}</td>
                <td>{a.blood_group}</td>
                <td>{a.license_no}</td>
                <td>{a.bike_no}</td>
                <td>{a.service_area}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No agents found for this area.</p>
      )}
    </div>
  );
}

export default DeliveryAgents;
