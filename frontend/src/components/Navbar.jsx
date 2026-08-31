import React from 'react';
import { LogOut, UserCircle } from "lucide-react";

export default function Navbar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("crm_user") || "{}");

  return (
    <header className="topbar">
      <div>
        <h1>Sales CRM</h1>
        <span>Leads & Deals Management</span>
      </div>
      <div className="top-actions">
        <div className="user-info">
          <UserCircle size={22} />
          <span>{user.name || "User"} · {user.role || "admin"}</span>
        </div>
        <button className="icon-btn" onClick={onLogout} title="Logout">
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}
