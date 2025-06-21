import React, { useState, useEffect } from 'react';
import './HomePage.css';

const generateUserId = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

const HomePage = ({ initialBalance = 0 }) => {
  const [userId, setUserId] = useState(() => {
    let id = localStorage.getItem('user_id');
    if (!id) {
      id = generateUserId();
      localStorage.setItem('user_id', id);
    }
    return id;
  });

  const [balance, setBalance] = useState(() => {
    const storedBalance = localStorage.getItem('balance');
    return storedBalance ? parseFloat(storedBalance) : initialBalance;
  });

  const [clicked, setClicked] = useState(false);
  const [floatingIncrements, setFloatingIncrements] = useState([]);

  // Сохраняем баланс в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('balance', balance.toFixed(2));
  }, [balance]);

  // Отправка баланса на сервер каждые 10 секунд
  useEffect(() => {
    const sendBalance = () => {
      const url = new URL('https://flyup.help/save_balance');
      url.searchParams.append('user_id', userId);
      url.searchParams.append('balance', balance);

      fetch(url.toString())
        .then(res => res.json())
        .then(data => console.log('✅ Баланс отправлен автоматически:', data))
        .catch(err => console.error('❌ Ошибка при отправке баланса:', err));
    };

    sendBalance(); // Отправить сразу при монтировании

    const interval = setInterval(() => {
      sendBalance();
    }, 10000); // 10 секунд

    return () => clearInterval(interval);
  }, [userId, balance]);

  const handleClick = () => {
    setClicked(true);

    const newBalance = +(balance + 0.01).toFixed(2);
    setBalance(newBalance);

    // Анимация +$0.01
    const id = Date.now();
    setFloatingIncrements(prev => [...prev, id]);
    setTimeout(() => setFloatingIncrements(prev => prev.filter(i => i !== id)), 1000);
    setTimeout(() => setClicked(false), 200);

    // **Убирать fetch из handleClick, т.к. теперь отправка по таймеру**
  };

  return (
    <div className="main-page">
      <div className="card-container">
        <img src="icons/card.png" alt="bank card" className="card-image" />
        <div className="card-balance">
          <div className="balance-label">Баланс:</div>
          <div className="balance-amount">${balance.toFixed(2)}</div>
        </div>
      </div>

      <div className="clicker-wrapper">
        <div
          className={`clicker-container ${clicked ? 'clicked' : ''}`}
          onClick={handleClick}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M0 10.9971V18C0 19.6569 1.34315 21 3 21H21C22.6569 21 24 19.6569 24 18V10.9971C23.9725 10.999 23.9447 11 23.9167 11H0.0833334C0.055294 11 0.0275035 10.999 0 10.9971Z"
              fill="black"
            />
            <path
              d="M24 9.00291V6C24 4.34315 22.6569 3 21 3H3C1.34315 3 0 4.34315 0 6V9.00291C0.0275035 9.00098 0.055294 9 0.0833334 9H23.9167C23.9447 9 23.9725 9.00098 24 9.00291Z"
              fill="black"
            />
          </svg>

          {floatingIncrements.map(id => (
            <div key={id} className="floating-plus">+$0.01</div>
          ))}
        </div>

        <div className="clicker-text">Нажимайте, чтобы заработать!</div>
      </div>
    </div>
  );
};

export default HomePage;
