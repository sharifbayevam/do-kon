import React, { useState, useEffect, useRef } from 'react'; // ⚡ useEffect va useRef qo'shildi
import './Mijozlar.css'; // Tashqi neon stillarni ulaymiz (Daxlsiz!)

function Mijozlar({ triggerFocus, setTriggerFocus }) { // ⚡ App.jsx dan kelayotgan proplar ulandi
  // Baza ma'lumotlari uchun boshlang'ich bo'sh massiv
  const [customers, setCustomers] = useState([]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // 1. Ism kiritadigan input uchun havola (ref)
  const nameInputRef = useRef(null);

  // 🌐 .env faylidan jonli Render backend havolasini o'qib olish
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // 2. Sahifa yuklanganda SQLite bazasidan real mijozlarni olish
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/customers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCustomers(data);
        }
      })
      .catch(err => console.error("Mijozlarni yuklashda xatolik:", err));
  }, [API_BASE_URL]);

  // 3. Kassadan "+ Yangi mijoz" bosilib o'tilganda inputni uyg'otish (Focus)
  useEffect(() => {
    if (triggerFocus && nameInputRef.current) {
      nameInputRef.current.focus();
      if (typeof setTriggerFocus === "function") {
        setTriggerFocus(false); // Signalni qayta o'chiramiz
      }
    }
  }, [triggerFocus, setTriggerFocus]);

  // 4. Yangi mijozni SQLite bazasiga saqlash
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!name) return alert("Mijoz ismini kiriting!");
    
    const newCustomer = {
      name,
      phone: phone || "Kiritilmagan"
    };

    fetch(`${API_BASE_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer)
    })
      .then(res => res.json())
      .then(savedCustomer => {
        if (savedCustomer && savedCustomer.id) {
          // Bazadagi yangi mijozni ro'yxat boshiga qo'shamiz
          setCustomers([savedCustomer, ...customers]);
          setName('');
          setPhone('');
        }
      })
      .catch(err => alert("Mijozni bazaga saqlashda xatolik yuz berdi."));
  };

  // 5. Mijozni SQLite bazasidan xavfsiz o'chirish
  const handleDeleteCustomer = (id) => {
    if (window.confirm("Haqiqatan ham bu mijozni o'chirmoqchisiz?")) {
      fetch(`${API_BASE_URL}/api/customers/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(() => {
          setCustomers(customers.filter(item => item.id !== id));
        })
        .catch(err => alert("Mijozni o'chirishda xatolik yuz berdi."));
    }
  };

  return (
    <div className="mijozlar-wrapper">
      
      {/* YANGI MIJOZ QO'SHISH FORMASI */}
      <div className="mijoz-card-glass">
        <h2 className="mijoz-title">👥 Yangi Mijozlarni Ro'yxatga Olish</h2>
        
        <form onSubmit={handleAddCustomer} className="mijoz-form">
          <input 
            ref={nameInputRef} // ⚡ Avtomatik fokus uchun ref shu yerga ulandi
            type="text" 
            placeholder="Mijoz ismi (Masalan: Jamshid, Vali...)" 
            value={name}
            onChange={e => setName(e.target.value)}
            className="mijoz-input-glass"
          />
          <input 
            type="text" 
            placeholder="Telefon raqami" 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="mijoz-input-glass"
          />
          <button type="submit" className="mijoz-btn-submit">
            + Ro'yxatga Qo'shish
          </button>
        </form>
      </div>

      {/* JADVAL RO'YXATI */}
      <div className="mijoz-table-box">
        <h3 className="mijoz-subtitle">📋 Ro'yxatdagi barcha mijozlar</h3>
        
        <table className="mijoz-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>T/R</th>
              <th>Mijoz Ismi</th>
              <th>Telefoni</th>
              <th>Umumiy Qarzi</th>
              <th style={{ textAlign: 'center', width: '120px' }}>Amal</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, index) => (
              <tr key={c.id}>
                <td className="tr-id">{index + 1}</td>
                <td className="mijoz-name-bold">{c.name}</td>
                <td className="mijoz-phone">{c.phone}</td>
                <td>
                  {c.debt > 0 ? (
                    <span className="debt-badge-active">{c.debt.toLocaleString()} so'm</span>
                  ) : (
                    <span className="debt-badge-clean">Qarzi yo'q</span>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDeleteCustomer(c.id)} // ⚡ Haqiqiy SQLite o'chirish funksiyasi ulandi
                    className="mijoz-btn-delete"
                  >
                    O'chirish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Mijozlar;