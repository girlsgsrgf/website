import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import GetFlypPage from './GetFlypPage';
import TasksPage from './TasksPage';
import RewardsPage from './RewardsPage';
import AirdropPage from './AirdropPage';
import CoursePage from './CoursePage';
import MessagePage from './MessagePage';
import ReadCoursePage from './ReadCoursePage';
import ReadCoursePage1 from './ReadCoursePage1';
import ReadCoursePage2 from './ReadCoursePage2';
import ReadCoursePage3 from './ReadCoursePage3';
import MarketplacePage from './MarketplacePage';


import DepositPage from './DepositPage';
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
      if (res.status === 403 || res.status === 401) {
        setIsAuthenticated(false);
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data) {
        setBalance(data.balance);
        setIsAuthenticated(true);
      }
    })
    .catch((error) => {
      console.error('Ошибка при загрузке баланса:', error);
      setIsAuthenticated(false);
    });
}, []);


  const tabs = [
    { key: 'home', icon: 'home.png', activeIcon: 'blue_home.png' },
    { key: 'wallet', icon: 'wallet.png', activeIcon: 'blue_wallet.png' },
    { key: 'marketplace', icon: 'shop.png', activeIcon: 'blue_shop.png' },
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
  try {
    if (activeTab === 'home') {
      if (subPage === 'getflyp') {
        return <GetFlypPage balance={balance} onNavigate={setSubPage} isAuthenticated={isAuthenticated} />;
      } else if (subPage === 'deposit') {
        return <DepositPage onNavigate={setSubPage} />;
      }
      return <HomePage onNavigate={setSubPage} balance={balance} />;
    } else if (activeTab === 'wallet') {
      if (subPage?.startsWith('readCourse')) {
        switch (subPage) {
          case 'readCourse1':
            return <ReadCoursePage1 />;
          case 'readCourse2':
            return <ReadCoursePage2 />;
          case 'readCourse3':
            return <ReadCoursePage3 />;
          default:
            return <div>Курс не найден</div>;
        }
      }
      return <CoursePage onNavigate={setSubPage} />;
    } else if (activeTab === 'news') {
      if (subPage === 'deposit') {
        return <DepositPage onNavigate={setSubPage} />;
      }
      return <GetFlypPage balance={balance} onNavigate={setSubPage} isAuthenticated={isAuthenticated} />;
    } else if (activeTab === 'marketplace') {
      return <MarketplacePage />;
    } else if (activeTab === 'settings') {
      return <MessagePage />;
    }

    return <div>Страница не найдена</div>;
  } catch (error) {
    console.error("Ошибка в renderContent:", error);
    return <div>Произошла ошибка при загрузке контента.</div>;
  }
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
