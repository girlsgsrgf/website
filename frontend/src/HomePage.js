import React from 'react';
import './HomePage.css';

const HomePage = ({ onNavigate, balance, dailyIncome }) => {
  return (
    <div className="main-page">
      <h2 className="app-title">Flyup Chain</h2>

      <div className="balance-section">
        <div className="balance-header">
          <div>
            <div className="balance-label">Total Balance</div>
            <div className="balance-amount">${balance.toFixed(2)} FLYP</div>
            <div className="wallet-link"> ≈ ${balance.toFixed(2)} USD</div>
          </div>
          <img src="/icons/logo.png" alt="logo" className="logo-image" />
        </div>

        <button className="get-flyp-button" onClick={() => onNavigate('getflyp')}><img src="/icons/getflyp.png" alt="dot" className="get-img" /> Get $FLYP</button>
        <div className="get-now">Claim now!</div>
      </div>

     

      <div className="news-box">
        <div className="news-header">24h Income</div>
        <div className="news-text">+ ${dailyIncome.toFixed(2)} FLYP</div>
        <div className="news-footer"><img src="/icons/perdaycoin.png" alt="dot" className="perdaycoin-img" /></div> 
      </div>

      <div className="features-row">
        <div className="feature-box" onClick={() => onNavigate('tasks')}>
          <img src="/icons/cashwallet.png" alt="dot" className="dot-img" />
          <div className="feature-text">Tasks</div>
        </div>
        <div className="feature-box" onClick={() => onNavigate('rewards')}>
          <img src="/icons/rewards.png" alt="dot" className="dot-img" />
          <div className="feature-text">Rewards</div>
        </div>
        <div className="feature-box" onClick={() => onNavigate('airdrop')}>
          <img src="/icons/airdrop.png" alt="dot" className="dot-img" />
          <div className="feature-text">Airdrop</div>
        </div>
      </div>
      <div className="level-card">
        <div>
          <div className="level-title">Our Instagram</div>
          <div className="level-subtitle">Subscribe for news</div>
        </div>
        <div>
          <a className="upgrade-button-a" href="https://instagram.com/flyupcoin"><button className="upgrade-button">Subscirbe</button></a>    
        </div>
        <img src="/icons/upgradeimg.png" alt="dot" className="level-img" />
      </div> 
    </div>
  );
};

export default HomePage;
