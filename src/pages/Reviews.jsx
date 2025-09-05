import React, { useEffect, useState } from "react";
import apiService from "../api/api";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiService({
          url: "/reviews",
          method: "GET",
        });
        setReviews(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      <h2>Customer Reviews</h2>
      <ul>
        {reviews.map((r) => (
          <li key={r.id}>
            <strong>{r.customerName}</strong> ({r.rating}/5): {r.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
