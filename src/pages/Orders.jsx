import React, { useEffect, useState } from "react";
import apiService from "../api/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiService({
          url: "/orders",
          method: "GET",
        });
        setOrders(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Vendor</th>
            <th>Customer</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.vendorName}</td>
              <td>{o.customerName}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
