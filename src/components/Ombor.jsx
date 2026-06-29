import React, { useState, useEffect } from 'react'; // ⚡ useEffect qo'shildi
import './Ombor.css'; // Yangi yozilgan css faylni import qilamiz (Daxlsiz!)

function Ombor() {
  // Bazadan keladigan haqiqiy mahsulotlar uchun boshlang'ich bo'sh massiv
  const [products, setProducts] = useState([]);

  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [price, setPrice] = useState('');

  // 🌐 .env faylidan jonli Render backend havolasini o'qib olish
  const API_BASE_URL = 'https://backend-magazin-1.onrender.com';

  // 1. Sahifa yuklanganda SQLite bazasidan barcha tovarlarni olib kelish
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(err => console.error("Ombor ma'lumotlarini yuklashda xatolik:", err));
  }, [API_BASE_URL]);

  // ❌ 2. Ombordan mahsulotni o'chirish funksiyasi (Yangi qo'shildi)
  const handleDeleteProduct = (id) => {
    if (window.confirm("Ushbu mahsulotni ombordan butunlay o'chirmoqchimisiz?")) {
      fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(resData => {
          if (resData.success) {
            // Kassada ham qolmasligi uchun ekrandan filter qilib tashlaymiz
            setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
          } else {
            alert(resData.message || "O'chirishda xatolik yuz berdi.");
          }
        })
        .catch(err => {
          console.error("Xatolik:", err);
          alert("Server bilan bog'lanishda xatolik ketdi.");
        });
    }
  };

  // 3. Yangi tovar qo'shish funksiyasini SQLite backendga ulash
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price) return alert("Nom va Sotish narxini kiriting!");
    
    // Backend kutyotgan formatda obyekt tayyorlaymiz
    const newProd = {
      barcode: barcode || null, // Bo'sh bo'lsa null ketadi
      name,
      category: category || 'Boshqa',
      stock: Number(stock) || 0,
      cost_price: Number(costPrice) || 0,
      price: Number(price) || 0
    };

    // Serverga so'rov yuboramiz
    fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd)
    })
      .then(res => res.json())
      .then(savedProduct => {
        if (savedProduct && savedProduct.error) {
          alert(`Xatolik: ${savedProduct.error}`);
        } else if (savedProduct && savedProduct.id) {
          // Bazaga muvaffaqiyatli saqlangach, uni jadval ro'yxati boshiga qo'shamiz
          setProducts([savedProduct, ...products]);
          
          // Formani tozalash
          setBarcode(''); 
          setName(''); 
          setCategory(''); 
          setStock(''); 
          setCostPrice(''); 
          setPrice('');
        }
      })
      .catch(err => alert("Tovarni saqlashda server bilan xatolik yuz berdi."));
  };

  return (
    <div className="ombor-wrapper">
      
      {/* HEADER + EXCEL BUTTONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 className="ombor-title">📦 Ombor Boshqaruvi</h2>
          <p className="ombor-subtitle">Shtrix-kodlar va Excel boshqaruvi</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => alert("Excel Import...!")} className="excel-btn-import">📥 Exceldan Tovar Yuklash</button>
          <button onClick={() => alert("Excel Export...!")} className="excel-btn-export">📤 Omborni Excelga olish</button>
        </div>
      </div>

      {/* YANGI TOVAR QO'SHISH FORMASI */}
      <div className="form-container-glass">
        <h3 className="form-title-glass">➕ Do'konga Yangi Mahsulot Kiritish</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label className="input-label-glass">Shtrix-kod (Barcode)</label>
            <input type="text" placeholder="Skanerlang..." value={barcode} onChange={e => setBarcode(e.target.value)} className="input-field-glass" />
          </div>
          <div>
            <label className="input-label-glass">Mahsulot Nomi *</label>
            <input type="text" placeholder="Masalan: Pepsi" value={name} onChange={e => setName(e.target.value)} className="input-field-glass" />
          </div>
          <div>
            <label className="input-label-glass">Kategoriya</label>
            <input type="text" placeholder="Ichimliklar" value={category} onChange={e => setCategory(e.target.value)} className="input-field-glass" />
          </div>
          <div>
            <label className="input-label-glass">Soni (Qoldiq)</label>
            <input type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} className="input-field-glass" />
          </div>
          <div>
            <label className="input-label-glass">Kelgan Narxi (Tannarx)</label>
            <input type="number" placeholder="Ulgurji" value={costPrice} onChange={e => setCostPrice(e.target.value)} className="input-field-glass" />
          </div>
          <div>
            <label className="input-label-glass">Sotilish Narxi *</label>
            <input type="number" placeholder="Chakana" value={price} onChange={e => setPrice(e.target.value)} className="input-field-glass" />
          </div>
          <div>
            <label></label>
            <button type="submit" className="btn-submit-glass">Saqlash</button>
          </div>
        </form>
      </div>

      {/* JADVAL */}
      <div className="table-container-glass">
        <table className="ombor-table-glass">
          <thead>
            <tr>
              <th>Shtrix-kod</th>
              <th>Mahsulot Nomi</th>
              <th>Kategoriya</th>
              <th>Qoldiq</th>
              <th>Kelgan Narxi</th>
              <th>Sotilish Narxi</th>
              <th>Amal</th> {/* 👈 Sarlavhaga yangi ustun qo'shildi */}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="barcode-text">{p.barcode || '—'}</td>
                <td className="prod-name-bold">{p.name}</td>
                <td><span className="cat-badge">{p.category}</span></td>
                <td><span className="stock-badge-ombor">{p.stock} ta</span></td>
                <td className="price-text-white">{(p.cost_price || 0).toLocaleString()} so'm</td>
                <td className="price-text-bold">{(p.price || 0).toLocaleString()} so'm</td>
                <td>
                  {/* 👈 O'chirish neon tugmasi */}
                  <button 
                    onClick={() => handleDeleteProduct(p.id)}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid #ef4444',
                      color: '#f87171',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#ef4444';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                      e.target.style.color = '#f87171';
                    }}
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

export default Ombor;