import React, { useEffect, useState } from "react";
import "./GetFlypPage.css";

export default function GetFlypPage() {
  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem("balance");
    return stored ? parseFloat(stored) : 0;
  });

  const [myProducts, setMyProducts] = useState([]);
  const [listings, setListings] = useState([]); // This will be your businesses list now
  const [viewMode, setViewMode] = useState("myProducts"); // 'myProducts' or 'listings'
  const [ownedBusinesses, setOwnedBusinesses] = useState([]); // to track purchased businesses
  const [showWithdrawWarning, setShowWithdrawWarning] = useState(false)

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    // Получение моих продуктов
    fetch(`/api/my-products/?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setMyProducts(data))
      .catch(console.error);

    // Получение листингов пользователя - теперь это список бизнесов
    fetch(`/api/businesses/`)  // assuming you have an endpoint that returns all businesses
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch(console.error);

    // Получение списка приобретенных бизнесов для текущего пользователя
    fetch(`/api/user-businesses/?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setOwnedBusinesses(data.map(b => b.business.id)))
      .catch(console.error);
  }, [userId]);

  const handleDepositClick = () => {
  setShowWithdrawWarning(true);
  setTimeout(() => setShowWithdrawWarning(false), 3000);
  };

  const handleSellClick = (productId) => {
    window.location.href = `/api/sell-product/${productId}/?user_id=${userId}`;
  };

  // Покупка бизнеса с проверкой баланса
  const handleBuyBusiness = (businessId, price) => {
    if (balance < price) {
      alert("Insufficient balance to buy this business!");
      return;
    }

    fetch("/api/buy-business/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `user_id=${userId}&business_id=${businessId}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBalance(parseFloat(data.new_balance));
          setOwnedBusinesses((prev) => [...prev, businessId]);
        } else {
          alert(data.error || "Failed to buy business");
        }
      })
      .catch(() => alert("Error during purchase"));
  };

  // Разбивка на 2 колонки для бизнеса
  const leftBusinesses = listings.filter((_, i) => i % 2 === 0);
  const rightBusinesses = listings.filter((_, i) => i % 2 !== 0);

  // Рендер бизнес-карточки с кнопкой Buy/Acquired
  const renderBusinessCard = (business) => {
    const owned = ownedBusinesses.includes(business.id);

    return (
      <div
        key={business.id}
        className="businesscard"
        style={{ backgroundColor: owned ? "#90ee90" : "#fff" }}
      >
        <div className="top-card"></div>
        <div className="bottom-card">
          <div className="card-content">
            <span className="card-title">{business.title}</span>
            <p className="card-txt">Price: ${business.price}</p>
            <p className="card-txt">Daily profit: ${business.daily_profit}</p>

            {owned ? (
              <button className="card-btn acquired" disabled>
                Acquired
              </button>
            ) : (
              <button
                className="card-btn"
                onClick={() => handleBuyBusiness(business.id, parseFloat(business.price))}
              >
                Buy
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Ваши функции для продуктов без изменений
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
    <>
      <div className="card-getflyp-container">
        <div className="getflyp-container">
          <div className="balance-section-getflyp">
            <p className="label">Your Balance</p>
            <h2 className="balance">${balance.toFixed(2)}</h2>
            <div className="button-row">
              <button className="deposit-btn" onClick={handleDepositClick}>
                Withdraw
              </button>
            </div>
          </div>
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
            <span>Owned Products</span>
          </label>
          <label>
            <input
              type="radio"
              name="radio"
              checked={viewMode === "listings"}
              onChange={() => setViewMode("listings")}
            />
            <span>Business</span>
          </label>
        </div>
      </div>

      <div className="my-products-section">
        <h3 className="section-title">
          {viewMode === "myProducts" ? "Your Products" : "Your Listings"}
        </h3>
        {viewMode === "myProducts"
          ? renderProductsInColumns(myProducts)
          : (
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {leftBusinesses.map(renderBusinessCard)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {rightBusinesses.map(renderBusinessCard)}
              </div>
            </div>
          )
        }
      </div>
      {showWithdrawWarning && (
      <div className="withdraw-warning-popup">
        Withdrawals are not available right now!
      </div>
       )}

    </>
  );
}
