import React from "react";
import "./GetFlypPage.css";

export default function GetFlypPage( onNavigate, balance ) {
  return (
    <div className="getflyp-container"> 
    <h2 className="app-title">Flyup Chain</h2>
      <div>  
        {/* Logo and Title */}
        <div className="logo-title">
          <img src="icons/wings.png" alt="Fly Up" className="wings-img" />
        </div>
        {/* Balance Section */}
        <div className="balance-section">
          <p className="label">Your Balance</p>
          <h2 className="balance">${balance.toFixed(2)}<span className="flyp">FLYP</span>
          </h2>
          <div className="button-row">
            <button className="deposit-btn">Deposit</button>
          </div>
          <div className="action-row">
            <button className="action-btn">
              Withdraw
            </button>
            <button className="action-btn">
            Swap
            </button>
          </div>
        </div>

        {/* Upgrade Section */}
        <div className="upgrade-section">
            <div className="card-content">
              <p className="label-upgrade">Income per day</p>
              <div className="income">${balance.toFixed(2)} FLYP</div>
              <div className="perdayimg-div"><img src="icons/perdaycoin.png" alt="coin" className="perdayimg" /></div>
              <div className="level-info">
                <div>
                  <p className="level">Level 1</p>
                  <p className="cost">$10 FLYP</p>
                </div>
                <img src="icons/upgradeimg.png" alt="coin" className="coin-img" />
              <div className="upgrade-btn-div"><button className="upgrade-btn">Upgrade</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
