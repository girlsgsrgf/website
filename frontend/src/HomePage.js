import React, { useEffect, useState } from 'react';
import './HomePage.css';

const HomePage = ({ onNavigate, balance, dailyIncome }) => {
  const [canClaim, setCanClaim] = useState(false);
  const [timer, setTimer] = useState(null);
  const [localBalance, setLocalBalance] = useState(balance);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  useEffect(() => {
    fetch('/api/check-auth/', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          fetch('/api/claim/', {
            method: 'POST',
            credentials: 'include'
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                setCanClaim(false);
                setTimer(24 * 60 * 60);
                setLocalBalance(data.balance);
              } else if (data.remaining_seconds) {
                setCanClaim(false);
                setTimer(data.remaining_seconds);
              } else {
                setCanClaim(true);
              }
            });
        }
      });
  }, []);

  useEffect(() => {
    if (timer === null) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClaim(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleClaim = () => {
    fetch('/api/claim/', {
      method: 'POST',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          setCanClaim(false);
          setTimer(data.next_claim_in);
          setLocalBalance(data.balance);
        } else if (data.remaining_seconds) {
          setCanClaim(false);
          setTimer(data.remaining_seconds);
        }
      });
  };

  return (
    <div className="main-page">
      <h2 className="app-title">Flyup Chain</h2>

      <div className="balance-section">
        <div className="balance-header">
          <div>
            <div className="balance-label">Total Balance</div>
            <div className="balance-amount">${localBalance.toFixed(2)} FLYP</div>
            <div className="wallet-link"> ≈ ${localBalance.toFixed(2)} USD</div>
          </div>
          <img src="/icons/logo.png" alt="logo" className="logo-image" />
        </div>

        <button className="get-flyp-button" onClick={() => onNavigate('getflyp')}>
          <img src="/icons/getflyp.png" alt="dot" className="get-img" /> Get $FLYP
        </button>
        <div className="get-now">Claim now!</div>
      </div>

      <div className="news-box">
        <div className="news-header">24h Income</div>
        <div className="news-text">+ ${dailyIncome.toFixed(2)} FLYP</div>
        <div className="news-footer">
          <img src="/icons/perdaycoin.png" alt="dot" className="perdaycoin-img" />
        </div> 
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
          <div className="level-title">Daily Claim</div>
          <div className="level-subtitle">Get 0.01 $FLYP every 24h</div>
        </div>
        <div>
          {isAuthenticated === false ? (
            <a href="/signup/">
              <button className="upgrade-button">Sign Up</button>
            </a>
          ) : canClaim ? (
            <button className="upgrade-button" onClick={handleClaim}>Claim</button>
          ) : (
            <div className="upgrade-button disabled">
              {timer !== null ? formatTime(timer) : 'Loading...'}
            </div>
          )}
        </div>
        <img src="/icons/upgradeimg.png" alt="dot" className="level-img" />
      </div>
    </div>
  );
};

export default HomePage;

