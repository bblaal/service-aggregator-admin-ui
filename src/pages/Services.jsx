// src/admin/ServicesAdmin.js
import React, { useEffect, useState } from "react";
import apiService from "../api/api";
import { useArea } from "../context/AreaContext";
import './css/ServiceAdmin.css';
import { constants } from "../constants/Constant";


function Services() {
    const { area } = useArea();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [newService, setNewService] = useState({
        name: "",
        category: "",
        description: "",
        address: "",
        phone: "",
        icon: "",
        area: area || "",
    });

    // ✅ Fetch services by area
    const fetchServices = async () => {
        if (!area) return;
        try {
            setLoading(true);
            const data = await apiService({
                url: `/api/services/${area}/all`,
                method: "GET",
            });
            setServices(data);
        } catch (err) {
            console.error("Error fetching services:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [area]);

    // ✅ Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewService((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Add new service (JSON payload)
    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            await apiService({
                url: `/api/services/${area}`,
                method: "POST",
                data: newService,
            });

            // Reset form
            setNewService({
                name: "",
                category: "",
                description: "",
                address: "",
                phone: "",
                icon: "",
                area: area || "",
            });

            fetchServices(); // Refresh table
        } catch (err) {
            console.error("Error adding service:", err);
        }
    };

    // ✅ Filter services by search query
    const filteredServices = services.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="services-container">
            <h2 className="page-title">Services for Area: {area}</h2>

            {/* Add Service Form */}
            <form onSubmit={handleAddService} className="service-form">
                <div className="form-row">
                    <select
                        name="category"
                        value={newService.category}
                        onChange={(e) => {
                            const category = e.target.value;
                            const icon = constants.servicesIcons[category] || "";
                            setNewService((prev) => ({ ...prev, category, icon }));
                        }}
                        required
                    >
                        <option value="">Select Category</option>
                        {Object.keys(constants.services).map((key) => (
                            <option key={key} value={key}>
                                {constants.services[key]}
                            </option>
                        ))}
                    </select>

                    <input
                        name="name"
                        value={newService.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />

                    <input
                        name="phone"
                        value={newService.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        required
                    />
                </div>

                <div className="form-row">
                    <input
                        name="description"
                        value={newService.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                    <input
                        name="address"
                        value={newService.address}
                        onChange={handleChange}
                        placeholder="Address"
                        required
                    />
                </div>

                <div className="form-row">
                    <input
                        name="icon"
                        value={newService.icon}
                        readOnly
                        placeholder="Auto-selected Icon"
                    />
                </div>


                <div className="form-row">
                    <button type="submit" className="submit-btn">
                        Add Service
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            setNewService({
                                name: "",
                                category: "",
                                description: "",
                                address: "",
                                phone: "",
                                icon: "",
                                area: area || "",
                            })
                        }
                        className="clear-btn"
                    >
                        Clear
                    </button>
                </div>
            </form>

            {/* Search Bar */}
            <div className="search-row">
                <input
                    type="text"
                    placeholder="Search services by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Services Table */}
            {loading ? (
                <p>Loading services...</p>
            ) : filteredServices.length > 0 ? (
                <table className="service-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Icon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map((s) => (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.name}</td>
                                <td>{s.category}</td>
                                <td>{s.description}</td>
                                <td>{s.address}</td>
                                <td>{s.phone}</td>
                                <td>{s.icon || " - "}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No services found for this area.</p>
            )}
        </div>
    );
}

export default Services;
