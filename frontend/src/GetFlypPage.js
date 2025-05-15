import React from "react";
import "./GetFlypPage.css";

export default function GetFlypPage() {
  return (
    <div className="getflyp-container">
      <div>
        {/* Header */}
        <div className="header">
          <h2>Flyup Chain</h2>
        </div>

        {/* Logo and Title */}
        <div className="logo-title">
          <img src="/wings.png" alt="Fly Up" className="wings-img" />
          <h1>Fly Up</h1>
          <p className="subtitle">ecosystem</p>
        </div>

        {/* Balance Section */}
        <div className="balance-section">
          <p className="label">Your Balance</p>
          <h2 className="balance">
            $0.00 <span className="flyp">FLYP</span>
          </h2>
          <div className="button-row">
            <button className="deposit-btn">Deposit</button>
          </div>
          <div className="action-row">
            <button className="action-btn">
              Withdraw <span className="icon">⬆️</span>
            </button>
            <button className="action-btn">
              Swap <span className="icon">🔁</span>
            </button>
          </div>
        </div>

        {/* Upgrade Section */}
        <div className="upgrade-section">
          <div className="upgrade-card">
            <div className="card-content">
              <p className="label">Income per day</p>
              <h3 className="income">+ $0.00 FLYP</h3>
              <div className="level-info">
                <div>
                  <p className="level">Level 1</p>
                  <p className="cost">$10 FLYP</p>
                </div>
                <img src="/coin.png" alt="coin" className="coin-img" />
              </div>
              <button className="upgrade-btn">Upgrade</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
