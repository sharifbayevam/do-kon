import React from "react";
import { NavLink } from "react-router-dom"; // ⚡ Linklar uchun tizim
import "./Sidebar.css"; // ⚡ Skrinshotdagi xato import shu yerda tuzatildi

function Sidebar() {
  return (
    <div className="sidebar-container">
      {/* Kassa Linki */}
      <NavLink to="/kassa" className={({ isActive }) => isActive ? "active-btn" : ""}>
        Kassa
      </NavLink>

      {/* Ombor Linki */}
      <NavLink to="/ombor" className={({ isActive }) => isActive ? "active-btn" : ""}>
        Ombor
      </NavLink>

      {/* Mijozlar Linki */}
      <NavLink to="/mijozlar" className={({ isActive }) => isActive ? "active-btn" : ""}>
        Mijozlar
      </NavLink>

      {/* Analitika Linki */}
      <NavLink to="/analtika" className={({ isActive }) => isActive ? "active-btn" : ""}>
        Analtika
      </NavLink>

      {/* Yangi Tovar Linki */}
      <NavLink to="/yangi-tovar" className={({ isActive }) => isActive ? "active-btn" : ""}>
        Yangi Tovar
      </NavLink>
    </div>
  );
}

export default Sidebar;