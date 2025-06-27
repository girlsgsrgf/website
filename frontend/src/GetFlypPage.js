import React, { useEffect, useState } from "react";
import "./GetFlypPage.css";

export default function GetFlypPage() {
  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem("balance");
    return stored ? parseFloat(stored) : 0;
  });

  const [myProducts, setMyProducts] = useState([]);
  const [listings, setListings] = useState([]);
  const [viewMode, setViewMode] = useState("myProducts"); // 'myProducts' or 'listings'

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    // Получение моих продуктов
    fetch(`/api/my-products/?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setMyProducts(data))
      .catch(console.error);

    // Получение листингов пользователя
    fetch(`/api/my-listings/?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch(console.error);
  }, []);

  const handleDepositClick = () => {
    window.location.href = "/deposit/";
  };

  const handleSellClick = (productId) => {
    window.location.href = `/api/sell-product/${productId}/?user_id=${localStorage.getItem("user_id")}`;
  };

  const renderProductsInColumns = (products) => {
    const left = products.filter((_, i) => i % 2 === 0);
    const right = products.filter((_, i) => i % 2 !== 0);

    return (
      <div className="marketplace-columns">
        <div className="marketplace-column">
          {left.map((product) => (
            <div key={product.id} className="my-product-card">
              <img src={product.image} alt={product.title} className="my-product-image" />
              <h4 className="my-product-title">{product.title}</h4>
              <p className="my-product-description">{product.description.slice(0, 40)}...</p>
              <p className="my-product-price"><strong>${product.price}</strong></p>
              <p className="my-product-quantity"><strong>Quantity: {product.quantity}</strong></p>
              {viewMode === "myProducts" && (
                <button className="sell-button" onClick={() => handleSellClick(product.id)}>
                  Sell for {product.price}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="marketplace-column">
          {right.map((product) => (
            <div key={product.id} className="my-product-card">
              <img src={product.image} alt={product.title} className="my-product-image" />
              <h4 className="my-product-title">{product.title}</h4>
              <p className="my-product-description">{product.description.slice(0, 40)}...</p>
              <p className="my-product-price"><strong>${product.price}</strong></p>
              <p className="my-product-quantity"><strong>Quantity: {product.quantity}</strong></p>
              {viewMode === "myProducts" && (
                <button className="sell-button" onClick={() => handleSellClick(product.id)}>
                  Sell for {product.price}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="getflyp-container">
      <div className="balance-section-getflyp">
        <p className="label">Ваш Баланс</p>
        <h2 className="balance">${balance.toFixed(2)}</h2>
        <div className="wallet-link-getflyp">{balance.toFixed(2)} USDT</div>
        <div className="button-row">
          <button className="deposit-btn" onClick={handleDepositClick}>
            Deposit
          </button>
        </div>
      </div>

      {/* Radio buttons for toggling */}
      <div className="mydict">
        <div>
          <label>
            <input
              type="radio"
              name="radio"
              checked={viewMode === "myProducts"}
              onChange={() => setViewMode("myProducts")}
            />
            <span>My products</span>
          </label>
          <label>
            <input
              type="radio"
              name="radio"
              checked={viewMode === "listings"}
              onChange={() => setViewMode("listings")}
            />
            <span>Sellings or listings</span>
          </label>
        </div>
      </div>

      <div className="my-products-section">
        <h3 className="section-title">
          {viewMode === "myProducts" ? "Your Products" : "Your Listings"}
        </h3>
        {viewMode === "myProducts" ? renderProductsInColumns(myProducts) : renderProductsInColumns(listings)}
      </div>
    </div>
  );
}
