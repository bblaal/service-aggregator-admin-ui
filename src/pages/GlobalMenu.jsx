import React, { useEffect, useState } from "react";
import apiService from "../api/api";
import "./css/GlobalMenu.css";

function GlobalMenu() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newItem, setNewItem] = useState({
    name: "",
  });
  const [itemImage, setItemImage] = useState(null);

  // ✅ Fetch menu items
  const fetchMenu = async () => {
    try {
      const data = await apiService({ url: "/api/vendors/globalMenu", method: "GET" });
      setItems(data);
    } catch (err) {
      console.error("Error fetching global menu:", err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle image
  const handleFileChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  // ✅ Add item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newItem.name);
      if (itemImage) formData.append("image", itemImage);

      await apiService({
        url: "/api/globalMenu/add",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewItem({ name: "" });
      setItemImage(null);
      fetchMenu();
    } catch (err) {
      console.error("Error adding menu item:", err);
    }
  };

  // ✅ Clear form
  const handleClear = () => {
    setNewItem({ name: "" });
    setItemImage(null);
  };

  // ✅ Pagination & Search
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="globalmenu-container">
      <h2 className="page-title">Global Menu</h2>

      {/* Form */}
      <form onSubmit={handleAddItem} className="menu-form">
        <input
          name="name"
          value={newItem.name}
          onChange={handleChange}
          placeholder="Item Name"
          required
        />
        
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <div className="form-buttons">
          <button type="submit">Add Item</button>
          <button type="button" onClick={handleClear} className="clear-btn">
            Clear
          </button>
        </div>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Table */}
      <table className="menu-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {displayedItems.length > 0 ? (
            displayedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ◀
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default GlobalMenu;
