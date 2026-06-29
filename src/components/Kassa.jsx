import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Kassa.css'; 
import { ShoppingBag, ShoppingCart, Search, Banknote, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react'; // Lupa va pul ikonkalari

function Kassa({ setTriggerFocus }) { // App.jsx dan trigger qabul qilindi
  const navigate = useNavigate(); 

  // Real bazadan keladigan ma'lumotlar statelari
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [cart, setCart] = useState([]);
  const [isQarz, setIsQarz] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('naqd'); // 'naqd' yoki 'karta'
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Buni yozing:
const API_BASE_URL = 'https://backend-magazin-1.onrender.com';

  // 1. Sahifa yuklanganda SQLite bazasidan hamma tovarlar va mijozlarni olib kelish
  useEffect(() => {
    // Tovarlarni olish
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); })
      .catch(err => console.error("Tovarlarni yuklashda xatolik:", err));

    // Mijozlarni olish
    fetch(`${API_BASE_URL}/api/customers`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCustomers(data); })
      .catch(err => console.error("Mijozlarni yuklashda xatolik:", err));
  }, [API_BASE_URL]);

  // 2. SHTRIX-KOD ORQALI AVTOMATIK SAVATGA QO'SHISH LOGIKASI
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Agar kiritilgan qiymat mahsulotlar ichidagi birorta shtrix-kodga 100% mos kelsa
    const foundProductByBarcode = products.find(p => p.barcode === value.trim());
    
    if (foundProductByBarcode) {
      addToCart(foundProductByBarcode); // Savatga qo'shish funksiyasini chaqiramiz
      setSearchTerm(''); // Inputni tozalaymiz (keyingi skanerlashga tayyor bo'ladi)
    }
  };

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

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalSum = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // 3. SAVDONI BACKENDGA JO'NATISH VA INTEGRATSIYA
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Savat bo'sh! Tovar tanlang.");
      return;
    }
    if (isQarz && !selectedCustomerId) {
      alert("Iltimos, qarzga yozish uchun mijozni tanlang!");
      return;
    }

    // Yakuniy to'lov turini aniqlaymiz (Agar nasiya chekboxi yoniq bo'lsa -> 'nasiya', aks holda -> 'naqd'/'karta')
    const finalPaymentMethod = isQarz ? 'nasiya' : paymentMethod;

    // Backend kutyotgan formatdagi savdo obyekti
    const checkoutData = {
      cartItems: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.qty
      })),
      paymentMethod: finalPaymentMethod,
      customerId: selectedCustomerId ? Number(selectedCustomerId) : null,
      totalSum: totalSum
    };

    // SQLite Serverga so'rov yuboramiz
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
          const mijozNomi = isQarz ? customers.find(c => c.id === Number(selectedCustomerId))?.name : `Naqd (${paymentMethod.toUpperCase()})`;
          alert(`🎉 Savdo muvaffaqiyatli SQLite'ga saqlandi!\n💰 Jami: ${totalSum.toLocaleString()} so'm\n👤 To'lov turi: ${finalPaymentMethod.toUpperCase()}\nMijoz: ${mijozNomi}`);
          
          // Oynani tozalash va real vaqtda ombor qoldiqlarini qayta yangilash
          setCart([]);
          setIsQarz(false);
          setSelectedCustomerId('');
          
          // Ombordagi yangilangan qoldiqlarni qayta yuklash
          return fetch(`${API_BASE_URL}/api/products`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setProducts(data); });
        }
      })
      .catch(err => alert("Savdoni yakunlashda server bilan bog'lanish imkoni bo'lmadi."));
  };

  return (
    <div className="kassa-wrapper">
      
      {/* CHAP TOMON: MAHSULOTLAR */}
      <div className="products-container">
        <h2 className="page-title"> <ShoppingCart/> Savdo Kassasi</h2>
        
        {/* Qidiruv paneli ichiga shtrix-kod va qidiruv logikasi ulandi */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type="text"
            className="search-bar"
            placeholder="Tovar nomini yoki Shtrix-kodni yozing..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
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
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                <tr key={p.id}>
                  <td className="prod-name">{p.name}</td>
                  <td><span className="badge-cat">{p.category}</span></td>
                  <td className={p.stock <= 5 ? "stock-alert" : "stock-normal"}>{p.stock} ta</td>
                  <td className="prod-price">{p.price.toLocaleString()} so'm</td>
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
                <div className="item-info">
                  <div className="item-title">{item.name}</div>
                  <div className="item-sub">{item.price.toLocaleString()} x {item.qty}</div>
                </div>
                <div className="item-total-price">
                  {(item.price * item.qty).toLocaleString()} uzs
                </div>
                <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))
          )}
        </div>

        <div className="total-summary-row">
          <span>Jami Summa:</span>
          <span className="total-price-text">{totalSum.toLocaleString()} so'm</span>
        </div>

        {/* TO'LOV USULINI TANLASH (KARTA yoki NAQD) — FAQAT NASIYA BO'LMAGANDA CHIQADI */}
        {!isQarz && cart.length > 0 && (
          <div style={{ display: 'flex', gap: '15px', margin: '15px 0', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', cursor: 'pointer', flex: 1 }}>
              <input type="radio" name="payment_type" checked={paymentMethod === 'naqd'} onChange={() => setPaymentMethod('naqd')} />
              <Banknote size={18} color="#10b981" /> Naqd pul
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', cursor: 'pointer', flex: 1 }}>
              <input type="radio" name="payment_type" checked={paymentMethod === 'karta'} onChange={() => setPaymentMethod('karta')} />
              <CreditCard size={18} color="#38bdf8" /> Plastik karta
            </label>
          </div>
        )}

        <div className="qarz-section">
          <label className="qarz-label">
            <input 
              type="checkbox" 
              checked={isQarz} 
              className="nasiya-btn"
              onChange={e => {
                setIsQarz(e.target.checked);
                if(!e.target.checked) setSelectedCustomerId('');
              }} 
            />
            ⚠️ Nasiyaga (Qarzga) sotish
          </label>
          
          {isQarz && (
            <select 
              value={selectedCustomerId} 
              className="customer-select"
              onChange={e => {
                if (e.target.value === "new_customer_redirect") {
                  if (typeof setTriggerFocus === "function") setTriggerFocus(true);
                  navigate("/mijozlar");
                } else {
                  setSelectedCustomerId(e.target.value);
                }
              }}
            >
              <option value=""><ArrowRight /> Mijozni tanlang <ArrowLeft /></option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="new_customer_redirect" style={{ fontWeight: 'bold', color: '#38bdf8' }}>
                ➕ Yangi mijoz qo'shish...
              </option>
            </select>
          )}
        </div>

        <button 
          onClick={handleCheckout} 
          className={`yakunlash-btn ${isQarz ? 'btn-qarz' : 'btn-success'}`}
        >
          {isQarz ? '🔒 Qarz Daftariga Yozish' : ' Savdoni Yakunlash'}
        </button>
      </div>

    </div>
  );
}

export default Kassa;