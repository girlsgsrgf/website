import React from 'react';
import './HomePage.css';

const HomePage = ({ onNavigate, balance }) => {
  return (
    <div className="main-page">
      <h2 className="app-title">Flyup Chain</h2>

      <div className="balance-section">
        <div className="balance-header">
          <div>
            <div className="balance-label">Your Balance</div>
            <div className="balance-amount">${balance ?? 0} FLYP</div>
            <div className="wallet-link">FlyupWallet</div>
          </div>
          <img src="/icons/logo.png" alt="logo" className="logo-image" />
        </div>

        <button className="get-flyp-button" onClick={() => onNavigate('getflyp')}><img src="/icons/getflyp.png" alt="dot" className="get-img" /> Get $FLYP</button>
        <div className="get-now">Get now!</div>
      </div>

      <div className="level-card">
        <div>
          <div className="level-title">Level 1</div>
          <div className="level-subtitle">$10 FLYP</div>
          <img src="/icons/dot.png" alt="dot" className="level-img" />
        </div>
        <div>
          <div className="upgrade-price">$30 FLYP</div>
          <button className="upgrade-button">Upgrade</button>
        </div>
      </div>

      <div className="features-row">
        <div className="feature-box" onClick={() => onNavigate('tasks')}>
          <img src="/icons/dot.png" alt="dot" className="dot-img" />
          <div className="feature-text">Tasks</div>
        </div>
        <div className="feature-box" onClick={() => onNavigate('rewards')}>
          <img src="/icons/dot.png" alt="dot" className="dot-img" />
          <div className="feature-text">Rewards</div>
        </div>
        <div className="feature-box" onClick={() => onNavigate('airdrop')}>
          <img src="/icons/dot.png" alt="dot" className="dot-img" />
          <div className="feature-text">Airdrop</div>
        </div>
      </div>

      <div className="news-box">
        <div className="news-header">News</div>
        <div className="news-text">$22M dollars are going to be staked...</div>
        <div className="news-footer">
          <span className="tweet-handle">@flyupchain</span>
          <span className="tweet-date">9 may</span>
          <span className="news-price">$6.21</span>
          <img src="/icons/dot-small.png" alt="dot" className="dot-small-img" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
