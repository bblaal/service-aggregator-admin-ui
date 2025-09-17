import axios from "axios";
import ReactDOM from "react-dom/client";
import Spinner from "../components/Spinner";

// 🔥 helper to show/hide spinner
let spinnerRoot = null;

function showSpinner() {
  if (!spinnerRoot) {
    const div = document.createElement("div");
    div.id = "global-spinner";
    document.body.appendChild(div);
    spinnerRoot = ReactDOM.createRoot(div);
  }
  spinnerRoot.render(<Spinner />);
}

function hideSpinner() {
  if (spinnerRoot) {
    spinnerRoot.unmount();
    document.getElementById("global-spinner")?.remove();
    spinnerRoot = null;
  }
}

const apiClient = axios.create({
  baseURL: process.env.BASE_URL
   // baseURL: 'https://service-aggregator-backend.onrender.com',
  // baseURL: 'http://localhost:4000',
});

// Add token & headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

/**
 * Generic API call wrapper
 */
const apiService = async ({ url, method, data = null, params = null }) => {
  try {
    showSpinner(); // ⏳ show before request

    const response = await apiClient({
      url,
      method,
      data,
      params,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.error ||
          `Request failed with status ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error("No response from server, please try again later.");
    } else {
      throw new Error(error.message);
    }
  } finally {
    hideSpinner(); // ✅ hide after response/error
  }
};

export default apiService;
