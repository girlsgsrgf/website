import React, { useState } from 'react';
import HomePage from './HomePage';
import GetFlypPage from './GetFlypPage';
import TasksPage from './TasksPage';
import RewardsPage from './RewardsPage';
import AirdropPage from './AirdropPage';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './App.css';

const { telegram_id } = useParams(); // должен быть доступен в маршруте
const [balance, setBalance] = useState(null);

useEffect(() => {
  if (telegram_id) {
    fetch(`/api/user/${telegram_id}/`)
      .then(res => res.json())
      .then(data => setBalance(data.balance))
      .catch(() => setBalance(0));
  }
}, [telegram_id]);


function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [subPage, setSubPage] = useState(null);

  const tabs = [
    { key: 'home', icon: 'home.png', activeIcon: 'blue_home.png' },
    { key: 'wallet', icon: 'wallet.png', activeIcon: 'blue_wallet.png' },
    { key: 'news', icon: 'news.png', activeIcon: 'blue_news.png' },
    { key: 'settings', icon: 'settings.png', activeIcon: 'blue_settings.png' },
  ];

  const handleTabClick = (tabKey) => {
  if (tabKey === activeTab && tabKey === 'home') {
    setSubPage(null); // если уже на home и снова кликнули — вернуться на главную
  } else {
    setActiveTab(tabKey);
    if (tabKey !== 'home') {
      setSubPage(null); // при переходе в другой tab — сбросить
    }
  }
};


  const renderContent = () => {
    if (activeTab === 'home') {
      switch (subPage) {
        case 'getflyp':
          return <GetFlypPage />;
        case 'tasks':
          return <TasksPage />;
        case 'rewards':
          return <RewardsPage />;
        case 'airdrop':
          return <AirdropPage />;
        default:
          return <HomePage onNavigate={setSubPage} balance={balance} />;

      }
    } else if (activeTab === 'wallet') {
      return <div className="page"><h1>💰 Wallet Page</h1></div>;
    } else if (activeTab === 'news') {
      return <div className="page"><h1>📰 News Page</h1></div>;
    } else if (activeTab === 'settings') {
      return <div className="page"><h1>⚙️ Settings Page</h1></div>;
    }

    return null;
  };

  return (
    <div className="app">
      <div className="content">
        {renderContent()}
      </div>

      <div className="bottom-menu">
        {tabs.map(tab => (
          <div
            key={tab.key}
            className={`menu-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.key)}
          >
            <img
              src={`/icons/${activeTab === tab.key ? tab.activeIcon : tab.icon}`}
              alt={tab.key}
              className="icon"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
