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

  const handleSellClick = (productId) => {
    // Переходим на страницу sell товара, где будет buy.html с кнопкой sell
    window.location.href = `api/sell-product/${productId}/`;  // Django URL, показывающий buy.html с sell-кнопкой
  };

  return (
    <div className="getflyp-container">
      <div>
        <div className="balance-section-getflyp">
          <p className="label">Ваш Баланс</p>
          <h2 className="balance">${balance.toFixed(2)}</h2>
          <div className="wallet-link-getflyp"> ≈ ${balance.toFixed(2)} USDT</div>
          <div className="button-row">
            <button
              className="deposit-btn"
              onClick={handleButtonClick}
            >
              {isAuthenticated ? "Deposit" : "Sign Up"}
            </button>
          </div>
        </div>

        {isAuthenticated && myProducts.length > 0 && (
          <div className="my-products-section">
            <h3 className="section-title">Your Products</h3>
            <div className="marketplace-columns">
              <div className="marketplace-column">
                {myProducts.filter((_, i) => i % 2 === 0).map(product => (
                  <div key={product.id} className="my-product-card">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="my-product-image"
                    />
                    <h4 className="my-product-title">{product.title}</h4>
                    <p className="my-product-description">{product.description.slice(0, 40)}...</p>
                    <p className="my-product-price"><strong>${product.price}</strong></p>
                    <p className="my-product-quantity"><strong>Quantity: {product.quantity}</strong></p>
                    <button
                      className="sell-button"
                      onClick={() => handleSellClick(product.id)}
                    >
                      Sell for {product.price}
                    </button>
                  </div>
                ))}
              </div>

              <div className="marketplace-column">
                {myProducts.filter((_, i) => i % 2 !== 0).map(product => (
                  <div key={product.id} className="my-product-card">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="my-product-image"
                    />
                    <h4 className="my-product-title">{product.title}</h4>
                    <p className="my-product-description">{product.description.slice(0, 40)}...</p>
                    <p className="my-product-price"><strong>${product.price}</strong></p>
                    <p className="my-product-quantity"><strong>Quantity: {product.quantity}</strong></p>
                    <button
                      className="sell-button"
                      onClick={() => handleSellClick(product.id)}
                    >
                      Sell for {product.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
