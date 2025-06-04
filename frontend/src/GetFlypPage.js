import React, { useCallback, useEffect, useState } from "react";
import "./GetFlypPage.css";

export default function GetFlypPage({ onNavigate, balance, isAuthenticated }) {
  const [myProducts, setMyProducts] = useState([]);

  // Получаем продукты пользователя, если он авторизован
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/my-products/')  // предположим такой эндпоинт отдаёт товары текущего пользователя
        .then(res => res.json())
        .then(data => setMyProducts(data))
        .catch(console.error);
    }
  }, [isAuthenticated]);

  const handleButtonClick = useCallback(() => {
    if (isAuthenticated) {
      onNavigate('deposit');  // Переход к DepositPage
    } else {
      window.location.href = '/signup/';  // Редирект на страницу регистрации
    }
  }, [isAuthenticated, onNavigate]);

  // Обработчик кнопки Sell (пример)
  const handleSellClick = (productId) => {
    fetch(`/api/sell-product/${productId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          // Обновляем список продуктов после успешной продажи
          setMyProducts(myProducts.filter(p => p.id !== productId));
          alert('Product put for sale successfully!');
        } else {
          alert('Failed to put product for sale.');
        }
      })
      .catch(() => alert('Error while putting product for sale.'));
  };

  return (
    <div className="getflyp-container">
      <h2 className="app-title">Flyup Chain</h2>
      <div>
        <div className="logo-title">
          <img src="icons/wings.png" alt="Fly Up" className="wings-img" />
        </div>

        <div className="balance-section-getflyp">
          <p className="label">Your Balance</p>
          <h2 className="balance">${balance.toFixed(2)} FLYP</h2>
          <div className="wallet-link-getflyp"> ≈ ${balance.toFixed(2)} USD</div>
          <div className="button-row">
            <button
              className="deposit-btn"
              onClick={handleButtonClick}
            >
              {isAuthenticated ? "Deposit" : "Sign Up"}
            </button>
          </div>
        </div>

        <div className="upgrade-section">
          <div className="card-content">
            <div className="level-info">
              <div>
                <p className="level">Our Instagram</p>
                <p className="cost">Subscribe for news</p>
              </div>
              <img src="icons/upgradeimg.png" alt="coin" className="coin-img" />
              <div className="upgrade-btn-div">
                <button className="upgrade-btn">
                  <a
                    className="upgrade-button-a"
                    href="https://instagram.com/flyupcoin"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Subscribe
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Блок с продуктами пользователя */}
        {isAuthenticated && myProducts.length > 0 && (
          <div className="my-products-section" style={{ marginTop: '40px' }}>
            <h3>Your Products</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {myProducts.map(product => (
                <div
                  key={product.id}
                  style={{
                    width: '45%',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '8px',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: '100%', height: 'auto', borderRadius: '6px' }}
                  />
                  <h4 style={{ margin: '10px 0' }}>{product.title}</h4>
                  <p>{product.description.slice(0, 40)}...</p>
                  <p><strong>${product.price}</strong></p>
                  <button
                    style={{
                      backgroundColor: '#c62828',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      width: '100%',
                      marginTop: '10px',
                      fontWeight: 'bold'
                    }}
                    onClick={() => handleSellClick(product.id)}
                  >
                    Sell for $50
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
