# 🚀 Futuristic Glassmorphism POS & Inventory Management System

A high-performance, responsive Full-Stack Retail POS (Point of Sale) and Inventory Management System featuring a premium futuristic **Neon Glassmorphism UI**. Built with **React** on the frontend and an optimized **Node.js/Express** backend backed by a relational **SQLite** database.

---

## ✨ Key Features

- **🛒 Smart Checkout (Kassa):** Real-time cart calculations with integrated barcode scanner support (instant autofocus and auto-add on barcode match). Flexible payment options including Cash, Card, and Credit (Nasiya).
- **📦 Advanced Inventory Management (Ombor):** Dynamic stock tracking with automated cost price, selling price, and intelligent margin/markup percentage calculations.
- **👥 Customer Credit Ledger (Mijozlar):** Integrated customer relations database tracking dynamic credits, debts, and seamless navigation triggers from the cash register.
- **📊 Real-time Business Analytics:** Fully dynamic analytics dashboard computing today's net profit margin, analyzing low-stock alerts (critical inventory control), and highlighting the top-selling products.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Hooks: `useState`, `useEffect`, `useRef`)
- **Routing:** React Router DOM v6
- **Styling:** Vanilla CSS3 (Custom Glassmorphic gradients, CSS grid, flexible layout architectures)
- **Icons:** Lucide React & React Icons

### Backend
- **Runtime Environment:** Node.js
- **Server Framework:** Express.js
- **Database:** SQLite (sqlite3)
- **CORS Management:** Enabled for seamless local cross-origin api integration

---

## 🚀 Architecture & Clean Code Practices

This project was developed adhering to production-ready design principles:
- **Separation of Concerns:** Client and Server logic are explicitly isolated.
- **Optimized SQL Queries:** Transactions like checkout handle multiple simultaneous operations—deducting warehouse stock while automatically logging sales records.
- **State Management:** Strict data flow utilizing localized hooks and structured callbacks for inter-component triggers.

---

## ⚙️ Installation & Setup

Follow these steps to run the application locally on your machine.

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME