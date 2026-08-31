import React from 'react';
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Contact, Handshake, Activity, Bell } from "lucide-react";

const links = [
  ["/", "Dashboard", LayoutDashboard],
  ["/leads", "Leads", Users],
  ["/contacts", "Contacts", Contact],
  ["/deals", "Deals", Handshake],
  ["/activity", "Activity", Activity],
  ["/notifications", "Notifications", Bell]
];

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("crm_user") || "{}");

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">S</div>
        <div>
          <strong>Sales CRM</strong>
        </div>
      </div>

      <nav>
        {links.map(([to, label, Icon]) => {
          if (label === "Activity" && user.role !== "admin") return null;
          return (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Icon size={19} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        
      </div>
    </aside>
  );
}
