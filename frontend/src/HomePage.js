import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = ({ balance: initialBalance }) => {
  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem('balance');
    return stored ? parseFloat(stored) : initialBalance;
  });
  const [clicked, setClicked] = useState(false);
  const [floatingIncrements, setFloatingIncrements] = useState([]);

  // Сохраняем баланс в localStorage
  useEffect(() => {
    localStorage.setItem('balance', balance.toFixed(2));
  }, [balance]);

  // 👆 Новый handleClick
  const handleClick = () => {
    setClicked(true);
    const newBalance = +(balance + 0.01).toFixed(2);
    setBalance(newBalance);

    // Анимация +$0.01
    const id = Date.now();
    setFloatingIncrements(prev => [...prev, id]);

    setTimeout(() => {
      setFloatingIncrements(prev => prev.filter(item => item !== id));
    }, 1000);

    setTimeout(() => setClicked(false), 200);

    // Отправка запроса
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    console.log("👉 telegramUser:", telegramUser);

    if (telegramUser?.id) {
      console.log("🚀 Отправка баланса:", newBalance);

      fetch('https://flyup.help/update_balance_by_telegram/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: telegramUser.id,
          username: telegramUser.username || `user_${telegramUser.id}`,
          balance: newBalance,
        }),
      })
        .then(res => res.json())
        .then(data => console.log("✅ Баланс отправлен:", data))
        .catch(err => console.error("❌ Ошибка отправки:", err));
    } else {
      console.warn("❗ Telegram user не найден");
    }
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
            <path d="M0 10.9971V18C0 19.6569 1.34315 21 3 21H21C22.6569 21 24 19.6569 24 18V10.9971C23.9725 10.999 23.9447 11 23.9167 11H0.0833334C0.055294 11 0.0275035 10.999 0 10.9971Z" fill="black" />
            <path d="M24 9.00291V6C24 4.34315 22.6569 3 21 3H3C1.34315 3 0 4.34315 0 6V9.00291C0.0275035 9.00098 0.055294 9 0.0833334 9H23.9167C23.9447 9 23.9725 9.00098 24 9.00291Z" fill="black" />
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
