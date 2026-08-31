import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Navbar onLogout={logout} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
