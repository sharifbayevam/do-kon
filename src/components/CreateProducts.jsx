import React, { useState, useEffect, useRef } from 'react';
import { Barcode, Scan, Percent, PlusCircle, PackagePlus, DollarSign, Tag, Layers, Layers3 } from 'lucide-react';
import './CreateProducts.css';

function CreateProducts() {
  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    category: 'Mevalar',
    stock: '',
    costPrice: '',
    sellingPrice: ''
  });

  const [marginInfo, setMarginInfo] = useState({ profit: 0, percent: 0 });
  const barcodeRef = useRef(null);

  // 🌐 .env faylidan jonli Render backend havolasini o'qib olish
const API_BASE_URL = 'https://backend-magazin-1.onrender.com';
  useEffect(() => {
    if (barcodeRef.current) {
      barcodeRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const cost = parseFloat(formData.costPrice) || 0;
    const sell = parseFloat(formData.sellingPrice) || 0;

    if (cost > 0 && sell > 0) {
      const profit = sell - cost;
      const percent = (profit / cost) * 100;
      setMarginInfo({ profit: profit.toFixed(0), percent: percent.toFixed(1) });
    } else {
      setMarginInfo({ profit: 0, percent: 0 });
    }
  }, [formData.costPrice, formData.sellingPrice]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextInput = document.getElementById('prod-name-input');
      if (nextInput) nextInput.focus();
    }
  };

  // ⚡ HAQIQIY SQLITE BACKENDGA ULASH QISMI
  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend serverimiz kutyotgan obyekt strukturasi
    const productData = {
      barcode: formData.barcode.trim() || null,
      name: formData.name.trim(),
      category: formData.category,
      stock: Number(formData.stock) || 0,
      cost_price: Number(formData.costPrice) || 0, // backend ustuni nomiga moslandi
      price: Number(formData.sellingPrice) || 0    // backend ustuni nomiga moslandi
    };

    fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
      .then(res => res.json())
      .then(savedProduct => {
        if (savedProduct && savedProduct.error) {
          // Masalan, shtrix-kod takroriy bo'lsa backend xato beradi
          alert(`Xatolik: ${savedProduct.error}`);
        } else if (savedProduct && savedProduct.id) {
          alert(`🎉 Mahsulot muvaffaqiyatli bazaga saqlandi: ${formData.name}`);
          
          // Formani tozalash va kursorni shtrix-kodga qaytarish
          setFormData({ barcode: '', name: '', category: 'Mevalar', stock: '', costPrice: '', sellingPrice: '' });
          if (barcodeRef.current) barcodeRef.current.focus();
        }
      })
      .catch(err => {
        console.error(err);
        alert("Server bilan bo'g'lanishda xatolik yuz berdi. Backend serveringiz yoniqmi?");
      });
  };

  return (
    <div className="premium-bg-wrapper">
      <div className="premium-form-card">
        
        <div className="form-header">
          <div className="form-header-icon">
            <PackagePlus size={22} />
          </div>
          <div>
            <h2>Yangi Mahsulot</h2>
            <p>Omborga mahsulot qo'shish paneli</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modern-grid-form">
          
          <div className="input-group full-width">
            <label><Barcode size={15} /> Shtrix Kod</label>
            <div className="input-with-action">
              <input 
                ref={barcodeRef}
                type="text" 
                name="barcode"
                placeholder="Shtrix-kodni kiriting yoki skanerlang" 
                value={formData.barcode}
                onChange={handleChange}
                onKeyDown={handleBarcodeKeyDown}
                required
              />
              <button type="button" className="action-inside-btn">
                <Scan size={14} />
                <span>Skaner</span>
              </button>
            </div>
          </div>

          <div className="input-group full-width">
            <label><Tag size={15} /> Mahsulot Nomi</label>
            <input 
              id="prod-name-input"
              type="text" 
              name="name"
              placeholder="Mahsulot nomini kiriting" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label><Layers size={15} /> Kategoriya</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Mevalar">Mevalar</option>
              <option value="Ichimliklar">Ichimliklar</option>
              <option value="Oziq-ovqat">Oziq-ovqat</option>
              <option value="Sut mahsulotlari">Sut mahsulotlari</option>
              <option value="Shirinliklar">Shirinliklar</option>
              <option value="Sabzavotlar">Sabzavotlar</option>
            </select>
          </div>

          <div className="input-group">
            <label><Layers3 size={15} /> Miqdori</label>
            <input 
              type="number" 
              name="stock"
              placeholder="Soni yoki hajmi" 
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label><DollarSign size={15} /> Kelish Narxi</label>
            <input 
              type="number" 
              name="costPrice"
              placeholder="Asl tannarxi" 
              value={formData.costPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label><DollarSign size={15} /> Sotish Narxi</label>
            <input 
              type="number" 
              name="sellingPrice"
              placeholder="Sotilish narxi" 
              value={formData.sellingPrice}
              onChange={handleChange}
              required
            />
            
            {marginInfo.percent > 0 && (
              <div className="smart-margin-badge animate-fade-in">
                <Percent size={13} />
                <span>Ustama: <strong>+{marginInfo.percent}%</strong> | Foyda: <strong>{marginInfo.profit} UZS</strong></span>
              </div>
            )}
          </div>

          <div className="form-submit-container full-width">
            <button type="submit" className="premium-submit-btn">
              <PlusCircle size={18} />
              Omborga Saqlash
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateProducts;