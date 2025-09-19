import React, { useState, useEffect } from "react";
import { useArea } from "../context/AreaContext";
import { useNavigate } from "react-router-dom";
import apiService from "../api/api";
import "./css/AreaModal.css";

const AreaModal = ({ onClose }) => {
  const { setArea } = useArea();
  const [areas, setAreas] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      try {
        const data = await apiService({
          url: "/api/fetchServiceArea",
          method: "GET",
        });

        if (data && data.length > 0) {
          setAreas(data.map(item => item.area));
          setSelected(data[0].area); // ✅ default first area as string
        }
        
      } catch (err) {
        console.error("❌ Failed to fetch areas:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleSubmit = () => {
    if (selected) {
      setArea(selected);  // ✅ always a string now
  
      if (onClose) {
        onClose();
        navigate("/");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Select Area</h3>

        {loading ? (
          <p>Loading areas...</p>
        ) : (
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="area-dropdown"
          >
            {areas.map((p, idx) => (
              <option key={idx} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}

        <div className="modal-actions">
          <button onClick={handleSubmit} disabled={!selected}>
            Save
          </button>
          {!onClose && (
            <button onClick={() => navigate("/login")} className="secondary">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaModal;
