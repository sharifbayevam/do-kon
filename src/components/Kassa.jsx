import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Kassa.css'; 
import { ShoppingBag, ShoppingCart, Banknote, CreditCard, ArrowLeft, ArrowRight, Barcode } from 'lucide-react';
import CubeBackground from './CubeBackground'; 

function Kassa({ setTriggerFocus }) { 
  const navigate = useNavigate(); 

  // Barcha kerakli statelar (Yorqin matnlar va Karta inputi uchun)
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [isQarz, setIsQarz] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('naqd'); 
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cardNumber, setCardNumber] = useState(''); // Karta raqami uchun state
  
  const [categories, setCategories] = useState(['Barchasi']);
  const [activeCategory, setActiveCategory] = useState('Barchasi');

  const API_BASE_URL = 'https://backend-magazin-1.onrender.com';

  // Ma'lumotlarni serverdan yuklash
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => { 
        if (Array.isArray(data)) {
          setProducts(data);
          const uniqueCats = ['Barchasi', ...new Set(data.map(p => p.category || 'Boshqa'))];
          setCategories(uniqueCats);
        } 
      })
      .catch(err => console.error("Tovarlarni yuklashda xatolik:", err));

    fetch(`${API_BASE_URL}/api/customers`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCustomers(data); })
      .catch(err => console.error("Mijozlarni yuklashda xatolik:", err));
  }, [API_BASE_URL]);

  // Savatga tovar qo'shish mantiqi
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) {
        alert(`Omborda faqat ${product.stock} ta tovar bor!`);
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      if (product.stock <= 0) {
        alert("Bu mahsulot omborda qolmagan!");
        return;
      }
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // 🔥 SHTRIX-KOD ORQALI AVTOMATIK TOPISH VA SAVATGA TASHLASH
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const foundProductByBarcode = products.find(p => p.barcode && p.barcode.trim() === value.trim());
    
    if (foundProductByBarcode) {
      addToCart(foundProductByBarcode); 
      setSearchTerm(''); // Topilganda input avtomatik bo'shashadi
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalSum = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Savdoni yakunlash va karta ma'lumotini yuborish
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Savat bo'sh! Tovar tanlang.");
      return;
    }
    if (isQarz && !selectedCustomerId) {
      alert("Iltimos, qarzga yozish uchun mijozni tanlang!");
      return;
    }

    const finalPaymentMethod = isQarz ? 'nasiya' : paymentMethod;

    const checkoutData = {
      cartItems: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.qty
      })),
      paymentMethod: finalPaymentMethod,
      customerId: selectedCustomerId ? Number(selectedCustomerId) : null,
      totalSum: totalSum,
      cardNumber: paymentMethod === 'karta' ? cardNumber : null // Karta raqami integratsiyasi
    };

    fetch(`${API_BASE_URL}/api/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.error) {
          alert(`Xatolik: ${resData.error}`);
        } else {
          alert("🎉 Savdo muvaffaqiyatli yakunlandi!");
          setCart([]);
          setIsQarz(false);
          setSelectedCustomerId('');
          setCardNumber('');
          return fetch(`${API_BASE_URL}/api/products`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setProducts(data); });
        }
      })
      .catch(err => alert("Server bilan bog'lanishda xatolik yuz berdi."));
  };

  const finalFilteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.barcode && p.barcode.includes(searchTerm));
    const matchesCategory = activeCategory === 'Barchasi' || (p.category || 'Boshqa') === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="cube-bg-main-wrapper">
      <div className="cube-canvas-screen"><CubeBackground /></div>
      <div className="cube-fluid-blur"></div>

      <div className="cube-inner-content kassa-wrapper">
        
        {/* CHAP TOMON: JADVAL */}
        <div className="products-container">
          <h2 className="page-title"> <ShoppingCart /> Savdo Kassasi</h2>
          
          <div className="search-bar-wrapper">
            <input 
              type="text"
              className="search-bar"
              placeholder="Tovar nomini kiriting yoki shtrix-kodni skanerlang..."
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus
            />
            <div className="barcode-icon-inside">
              <Barcode size={22} color="#60a5fa" />
            </div>
          </div>

          <div className="category-container">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="table-responsive-box">
            <table className="kassa-table">
              <thead>
                <tr>
                  <th>Mahsulot Nomi</th>
                  <th>Kategoriya</th>
                  <th>Qoldiq</th>
                  <th>Sotish Narxi</th>
                  <th style={{ textAlign: 'center' }}>Amal</th>
                </tr>
              </thead>
              <tbody>
                {finalFilteredProducts.map(p => (
                  <tr key={p.id} className="kassa-table-row">
                    <td>
                      <div className="prod-name-block">
                        <span className="prod-title-text">{p.name}</span>
                        <span className="prod-barcode-sub">║▌ {p.barcode || 'kodsuz'}</span>
                      </div>
                    </td>
                    <td><span className="badge-cat">{p.category || 'Boshqa'}</span></td>
                    <td className={p.stock <= 5 ? "stock-alert" : "stock-normal"}>{p.stock} ta</td>
                    <td className="prod-price-bold">{p.price.toLocaleString()} so'm</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="select-btn" onClick={() => addToCart(p)}>Tanlash</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* O'NG TOMON: SAVAT */}
        <div className="savat-container">
          <h3 className="cart-header">
            <span> <ShoppingBag/> Xarid Savati</span>
            <span className="cart-count">{cart.length} xil</span>
          </h3>

          <div className="cart-items-list">
            {cart.length === 0 ? (
              <div className="empty-cart">Savatga tovar qo'shilmagan</div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item-card">
                  <div>
                    <div className="item-title">{item.name}</div>
                    <div className="item-sub">{item.price.toLocaleString()} x {item.qty}</div>
                  </div>
                  <div className="item-total-price">{(item.price * item.qty).toLocaleString()} UZS</div>
                  <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                </div>
              ))
            )}
          </div>

          <div className="total-summary-row">
            <span>Jami Summa:</span>
            <span className="total-price-text">{totalSum.toLocaleString()} so'm</span>
          </div>

          {/* 💳 TO'LOV TURI VA PLASTIK INPUT INTEGRATSIYASI */}
          {!isQarz && cart.length > 0 && (
            <div className="payment-block-wrapper">
              <div className="payment-methods-box">
                <label className={`pay-method-label ${paymentMethod === 'naqd' ? 'checked' : ''}`}>
                  <input 
                    type="radio" 
                    name="pay_method" 
                    checked={paymentMethod === 'naqd'} 
                    onChange={() => setPaymentMethod('naqd')} 
                  />
                  <Banknote size={18} color="#10b981" /> <span>Naqd pul</span>
                </label>
                <label className={`pay-method-label ${paymentMethod === 'karta' ? 'checked' : ''}`}>
                  <input 
                    type="radio" 
                    name="pay_method" 
                    checked={paymentMethod === 'karta'} 
                    onChange={() => setPaymentMethod('karta')} 
                  />
                  <CreditCard size={18} color="#f1760a" /> <span>Plastik karta</span>
                </label>
              </div>

              {paymentMethod === 'karta' && (
                <div className="card-input-container">
                  <div className="card-input-chip"></div>
                  <input 
                    type="text" 
                    className="card-number-input" 
                    placeholder="0000 0000 0000 0000"
                    maxLength="19"
                    value={cardNumber}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
                      setCardNumber(formatted);
                    }}
                  />
                  <span className="card-input-logo">⚡ PLASTIK</span>
                </div>
              )}
            </div>
          )}

          <div className="qarz-section">
            <label className="qarz-label">
              <input type="checkbox" checked={isQarz} onChange={e => { setIsQarz(e.target.checked); if(!e.target.checked) setSelectedCustomerId(''); }} />
              ⚠️ Nasiyaga sotish
            </label>
            {isQarz && (
              <select value={selectedCustomerId} className="customer-select" onChange={e => e.target.value === "redirect" ? navigate("/mijozlar") : setSelectedCustomerId(e.target.value)}>
                <option value="">Mijozni tanlang</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                <option value="redirect">+ Yangi mijoz...</option>
              </select>
            )}
          </div>

          <button onClick={handleCheckout} className={`yakunlash-btn ${isQarz ? 'btn-qarz' : 'btn-success'}`}>
            {isQarz ? '🔒 Qarz Daftariga Yozish' : 'Savdoni Yakunlash'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Kassa;