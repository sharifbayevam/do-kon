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

  // 2. Yangi tovar qo'shish funksiyasini SQLite backendga ulash
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Ombor;