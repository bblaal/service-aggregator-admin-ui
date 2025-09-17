import React, { useEffect, useState } from "react";
import apiService from "../api/api";
import "./css/GlobalMenu.css";

function GlobalMenu() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // single item form
  const [newItem, setNewItem] = useState({ name: "" });
  const [itemImage, setItemImage] = useState(null);

  // excel upload
  const [excelFile, setExcelFile] = useState(null);

  // ✅ Fetch menu items
  const fetchMenu = async () => {
    try {
      const data = await apiService({
        url: "/api/vendors/globalMenu",
        method: "GET",
      });
      setItems(data);
    } catch (err) {
      console.error("Error fetching global menu:", err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // ✅ Single item form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setItemImage(e.target.files[0]);
  };

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

  const handleClear = () => {
    setNewItem({ name: "" });
    setItemImage(null);
  };

  // ✅ Excel form handlers
  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) return;

    try {
      const formData = new FormData();
      formData.append("excel", excelFile);

      await apiService({
        url: "/api/globalMenu/uploadExcel",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setExcelFile(null);
      fetchMenu();
    } catch (err) {
      console.error("Error uploading Excel file:", err);
    }
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

      {/* === Single Item Upload === */}
      <div className="form-section">
  {/* === Single Item Upload === */}
  <form onSubmit={handleAddItem} className="menu-form">
    <h3>Add Single Menu Item</h3>
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

  {/* === Excel Upload === */}
  <form onSubmit={handleExcelUpload} className="menu-form excel-form">
    <h3>Upload Excel (Bulk)</h3>
    <input
      type="file"
      accept=".xlsx,.xls"
      onChange={handleExcelChange}
      required
    />
    <div className="form-buttons">
      <button type="submit">Upload Excel</button>
    </div>
  </form>
</div>


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
                  {item.imageurl ? (
                    <img
                      src={item.imageurl}
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
