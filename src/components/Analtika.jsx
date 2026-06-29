import React, { useState, useEffect } from 'react'; // ⚡ useEffect va useState qo'shildi
import { TrendingUp, DollarSign, PackageX, Sparkles, Trophy, Zap } from 'lucide-react';
import './Analtika.css'; // Mavjud neon stillar (Daxlsiz!)
import CubeBackground from './CubeBackground'; // Fondagi kubik qobig'i (Daxlsiz!)

function Analtika() {
  // Real bazadan hisoblanadigan statelar
  const [todayProfit, setTodayProfit] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [topProduct, setTopProduct] = useState("Yuklanmoqda...");
  const [lowStockItems, setLowStockItems] = useState([]);

  // 1. Sahifa yuklanganda SQLite bazasidan ma'lumotlarni hisoblab olish
  useEffect(() => {
// Buni yozing:
const API_BASE_URL = 'https://backend-magazin-1.onrender.com';
    // Ombordagi kam qolgan tovarlarni va ularning sonini olish
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(products => {
        if (Array.isArray(products)) {
          // Qoldig'i 5 tadan kam yoki teng bo'lgan tahlika guruhidagi tovarlar
          const criticalItems = products.filter(p => p.stock <= 5);
          setLowStockItems(criticalItems);
          setLowStockCount(criticalItems.length);
        }
      })
      .catch(err => console.error("Mahsulotlarni tahlil qilishda xatolik:", err));

    // Bugungi savdolar va eng xaridorgir mahsulotni aniqlash
    fetch(`${API_BASE_URL}/api/sales`)
      .then(res => res.json())
      .then(sales => {
        if (Array.isArray(sales)) {
          const bugun = new Date().toISOString().split('T')[0]; // YYYY-MM-DD formatda bugungi sana

          let profitSum = 0;
          const productQuantities = {};

          sales.forEach(sale => {
            // Faqat bugungi kunda bo'lgan savdolarni ajratib olamiz
            if (sale.sale_date && sale.sale_date.startsWith(bugun)) {
              // Har bir savdoning sof foydasi = (sotish_narxi - kelgan_narxi) * sotilgan_miqdori
              const cost = sale.cost_price || 0;
              const price = sale.price || 0;
              const qty = sale.quantity || 0;
              
              profitSum += (price - cost) * qty;
            }

            // Eng xaridorgir mahsulotni aniqlash uchun barcha davrdagi savdolarni hisoblaymiz
            if (sale.product_name) {
              productQuantities[sale.product_name] = (productQuantities[sale.product_name] || 0) + (sale.quantity || 0);
            }
          });

          // Bugungi jami sof foydani saqlaymiz
          setTodayProfit(profitSum);

          // Eng ko'p sotilgan tovar nomini topish mantiqi
          const sortedProducts = Object.entries(productQuantities).sort((a, b) => b[1] - a[1]);
          if (sortedProducts.length > 0) {
            setTopProduct(sortedProducts[0][0]); // Eng ko'p sotilgan tovar nomi
          } else {
            setTopProduct("Savdo mavjud emas");
          }
        }
      })
      .catch(err => console.error("Savdolarni tahlil qilishda xatolik:", err));
  }, []);

  return (
    <CubeBackground>
      
      {/* 1. Statistika kartalari */}
      <div className="analytics-grid">
        <div className="stat-glow-card profit">
          <div className="stat-card-header">
            <span>Bugungi Sof Foyda</span>
            <div className="stat-icon-box green"><DollarSign size={18} /></div>
          </div>
          <h3>+{todayProfit.toLocaleString()} UZS</h3>
          <p className="stat-trend positive"><TrendingUp size={14} /> Real vaqtda yangilanmoqda</p>
        </div>

        <div className="stat-glow-card warning">
          <div className="stat-card-header">
            <span>Tugayotgan Mahsulotlar</span>
            <div className="stat-icon-box red"><PackageX size={18} /></div>
          </div>
          <h3>{lowStockCount} ta tovar</h3>
          <p className="stat-trend negative">Zudlik bilan buyurtma bering</p>
        </div>

        <div className="stat-glow-card premium-accent">
          <div className="stat-card-header">
            <span>Xaridorgir Mahsulot</span>
            <div className="stat-icon-box blue"><Trophy size={18} /></div>
          </div>
          <h3>{topProduct}</h3>
          <p className="stat-trend neutral">Eng ko'p dona sotilgan mahsulot</p>
        </div>
      </div>

      {/* 2. Jadval va Chaqmoq karta */}
      <div className="analytics-main-content">
        <div className="table-analytics-section">
          <div className="section-title-wrapper">
            <Sparkles size={16} className="text-blue" />
            <h4>Kritik Qoldiqlar (Ombor Nazorati)</h4>
          </div>
          <div className="mini-stock-list">
            {lowStockItems.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.4)', padding: '15px 0' }}>Omborda xavfli darajadagi tovarlar yo'q 👍</div>
            ) : (
              lowStockItems.map(item => (
                <div key={item.id} className="stock-alert-row">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-cat">{item.category}</span>
                  </div>
                  <div className="item-badge-status">Faqat {item.stock} ta qoldi</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lightswind-upgrade-card">
          <div className="electric-border-effect"></div>
          <div className="upgrade-content">
            <div className="zap-badge"><Zap size={16} /><span>PRO Intel</span></div>
            <h2>Pro Dashboard Access</h2>
            <p className="upgrade-subtitle">Unlock advanced business analytics.</p>
            <button className="upgrade-action-btn">Upgrade Now</button>
          </div>
        </div>
      </div>

    </CubeBackground>
  );
}

export default Analtika;