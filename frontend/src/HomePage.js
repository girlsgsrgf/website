import React, { useState } from 'react';
import './HomePage.css';

const HomePage = ({ balance: initialBalance }) => {
  const [balance, setBalance] = useState(initialBalance);
  const [clicked, setClicked] = useState(false);
  const [showIncrement, setShowIncrement] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setBalance(prev => +(prev + 0.01).toFixed(2));
    setShowIncrement(true);
    setTimeout(() => setShowIncrement(false), 1000);
    setTimeout(() => setClicked(false), 200); // revert icon if needed
  };

  return (
    <div className="main-page">
      <div className="card-container">
        <img src="icons/card.png" alt="bank card" className="card-image" />
        <div className="card-balance">
          <div className="balance-label">Баланс:</div>
          <div className="balance-amount">${balance.toFixed(2)} FLYP</div>
        </div>
      </div>

      <div className="clicker-container" onClick={handleClick}>
        {clicked ? (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M0 10.9971V18C0 19.6569 1.34315 21 3 21H21C22.6569 21 24 19.6569 24 18V10.9971C23.9725 10.999 23.9447 11 23.9167 11H0.0833334C0.055294 11 0.0275035 10.999 0 10.9971Z" fill="black"/>
            <path d="M24 9.00291V6C24 4.34315 22.6569 3 21 3H3C1.34315 3 0 4.34315 0 6V9.00291C0.0275035 9.00098 0.055294 9 0.0833334 9H23.9167C23.9447 9 23.9725 9.00098 24 9.00291Z" fill="black"/>
          </svg>
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 6C0 4.34315 1.34315 3 3 3H21C22.6569 3 24 4.34315 24 6V18C24 19.6569 22.6569 21 21 21H3C1.34315 21 0 19.6569 0 18V6ZM2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6V9H2V6ZM22 11V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V11H22Z" fill="black"/>
          </svg>
        )}

        {showIncrement && <div className="floating-plus">+$0.01</div>}
      </div>
    </div>
  );
};

export default HomePage;
