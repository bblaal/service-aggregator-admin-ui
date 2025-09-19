import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AreaModal from "./components/AreaModal";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import DeliveryAgents from "./pages/DeliveryAgents";
import Orders from "./pages/Orders";
import GlobalMenu from "./pages/GlobalMenu";
import Reviews from "./pages/Reviews";
import ServiceArea from "./pages/ServiceArea";

import { useAuth, AuthProvider } from "./context/AuthContext";
import { useArea, AreaProvider } from "./context/AreaContext";

import './App.css';

// ✅ PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;

};

const AppRoutes = () => {
  const { area } = useArea();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            {!area ? <Navigate to="/select-area" replace /> : <Layout />}
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="delivery-agents" element={<DeliveryAgents />} />
        <Route path="orders" element={<Orders />} />
        <Route path="global-menu" element={<GlobalMenu />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="service-area" element={<ServiceArea />} />
      </Route>

      {/* Separate blocking route for area selection */}
      <Route
        path="/select-area"
        element={
          <PrivateRoute>
            <AreaModal fullScreen />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AreaProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AreaProvider>
    </AuthProvider>
  );
}

export default App;
