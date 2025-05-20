import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import GetFlypPage from './GetFlypPage';
import TasksPage from './TasksPage';
import RewardsPage from './RewardsPage';
import AirdropPage from './AirdropPage';
import CoursePage from './CoursePage';
import RoadMapPage from './RoadMapPage';
import ReadCoursePage from './ReadCoursePage';
import RegisterPage from './RegisterPage';
import './App.css';
import './BottomSheet.css';

const App = () => {
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [subPage, setSubPage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    fetch('/api/get-balance/', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка получения баланса');
      return res.json();
    })
      .then((data) => {
        setBalance(data.balance);
    })
      .catch((error) => {
        console.error('Ошибка при загрузке баланса:', error);
    });


    // Проверка авторизации с сервера Django
    fetch('/api/check-auth/', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
      })
      .catch((error) => {
        console.error('Ошибка проверки авторизации:', error);
        setIsAuthenticated(false);
      });
  }, []);

  const tabs = [
    { key: 'home', icon: 'home.png', activeIcon: 'blue_home.png' },
    { key: 'wallet', icon: 'wallet.png', activeIcon: 'blue_wallet.png' },
    { key: 'news', icon: 'news.png', activeIcon: 'blue_news.png' },
    { key: 'settings', icon: 'settings.png', activeIcon: 'blue_settings.png' },
  ];

  const handleTabClick = (tabKey) => {
    if (tabKey === activeTab && tabKey === 'home') {
      setSubPage(null);
    } else {
      setActiveTab(tabKey);
      setSubPage(null);
    }
  };

  const isBottomSheetPage = (page) =>
    ['tasks', 'rewards', 'airdrop'].includes(page);

  const renderBottomSheet = () => {
    if (!subPage || !isBottomSheetPage(subPage)) return null;

    let Content;
    switch (subPage) {
      case 'tasks':
        Content = TasksPage;
        break;
      case 'rewards':
        Content = RewardsPage;
        break;
      case 'airdrop':
        Content = AirdropPage;
        break;
      default:
        return null;
    }

    return (
      <div className="bottom-sheet-overlay" onClick={() => setSubPage(null)}>
        <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
          <Content onNavigate={setSubPage} />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'home') {
      if (subPage === 'getflyp') {
        // Если пользователь не авторизован — редирект на Django-шаблон
        if (!isAuthenticated) {
          window.location.href = '/signup/';
          return null;
        }
        return <GetFlypPage />;
      }

      return <HomePage onNavigate={setSubPage} balance={balance} />;
    } else if (activeTab === 'wallet') {
      if (subPage === 'readCourse') return <ReadCoursePage onNavigate={setSubPage} />;
      return <CoursePage onNavigate={setSubPage} />;
    } else if (activeTab === 'news') {
      if (!isAuthenticated) {
          window.location.href = '/signup/';
          return null;
      }
      return <GetFlypPage />;
    } else if (activeTab === 'settings') {
      return <RoadMapPage />;
    }

    return null;
  };

  return (
    <div className="app">
      <div className="content">
        {renderContent()}
        {renderBottomSheet()}
      </div>

      <div className="bottom-menu">
        {tabs.map((tab) => (
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
};

export default App;
