import React, { useCallback } from "react";
import "./GetFlypPage.css";

export default function GetFlypPage({ onNavigate, balance, isAuthenticated }) {
  
  const handleButtonClick = useCallback(() => {
    if (isAuthenticated) {
      onNavigate('deposit');  // Переход к DepositPage
    } else {
      window.location.href = '/signup/';  // Редирект на страницу регистрации
    }
  }, [isAuthenticated, onNavigate]);

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
      </div>
    </div>
  );
}

