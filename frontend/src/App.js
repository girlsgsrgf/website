import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SendMessage from './SendMessage';
import HomePage from './HomePage';
import GetFlypPage from './GetFlypPage';
import TasksPage from './TasksPage';
import RewardsPage from './RewardsPage';
import AirdropPage from './AirdropPage';
import CoursePage from './CoursePage';
import MessagePage from './MessagePage';
import ReadCoursePage1 from './ReadCoursePage1';
import ReadCoursePage2 from './ReadCoursePage2';
import ReadCoursePage3 from './ReadCoursePage3';
import MarketplacePage from './MarketplacePage';
import DepositPage from './DepositPage';
import Stepper, { Step } from './Stepper';


import './App.css';
import './BottomSheet.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [subPage, setSubPage] = useState(null);
  const [firstTime, setFirstTime] = useState(() => !localStorage.getItem('notfirsttime'));
  const [showStepper, setShowStepper] = useState(false);
  const [name, setName] = useState('');


  const handlePlayNow = () => {
    const button = document.querySelector('button');
    if (button) {
      button.classList.add('clicked');
    }

    // Wait 3 seconds, then show the stepper (instead of ending the intro)
    setTimeout(() => {
      setShowStepper(true); // ✅ show stepper after delay
    }, 2500);
  };

  if (firstTime) {
    return (
      <div className="start-screen">
        {!showStepper && (
          <button  className="play-now-button" onClick={handlePlayNow}>
            <span>PLAY NOW</span>
          </button>
        )}

        {showStepper && (
          <div className="stepper-overlay">
            <Stepper
              initialStep={1}
              onStepChange={(step) => {
                console.log(step);
              }}
              onFinalStepCompleted={() => {
                localStorage.setItem('notfirsttime', 'true');
                localStorage.setItem('ref', name); // ✅ store the name
                setFirstTime(false);
              }}

              backButtonText="Previous"
              nextButtonText="Next"
            >
              <Step>
                <h2 style={{ color: 'black' }}>Welcome to Batman: Legacy!</h2>
                <p style={{ color: 'black', fontWeight: "bold" }}>Earn USDT, Trade and get Rich!</p>
              </Step>
              <Step>
                <h2 style={{ color: 'black' }}>Step 2</h2>
                <p style={{ color: 'black', marginTop: '-0.6em', fontWeight: "bold"}}>Remember for each referral you get $25,000</p>
              </Step>
              <Step>
                <h2 style={{ color: 'black' }}>Do you have a Referral code?</h2>
                <input className='stepsinput' style={{borderRadius: '30px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'grey', height: '30px', width: '75%', fontSize:'15px'}}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Referral Code"
                />
              </Step>
              <Step>
                <h2 style={{ color: 'black' }}>Final Step</h2>
                <p style={{ color: 'black', fontWeight: "bold" }}>You made it! Enjoy the game!</p>
              </Step>
            </Stepper>
          </div>
        )}
      </div>
    );
  }


  const homeSvg = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6139 1.21065C12.2528 0.929784 11.7472 0.929784 11.3861 1.21065L2.38606 8.21065C2.14247 8.4001 2 8.69141 2 9V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V9C22 8.69141 21.8575 8.4001 21.6139 8.21065L12.6139 1.21065ZM16 20H20V9.48908L12 3.26686L4 9.48908V20H8V12C8 11.4477 8.44772 11 9 11H15C15.5523 11 16 11.4477 16 12V20ZM10 20V13H14V20H10Z" fill="white"/> </svg>);
  const activeHome = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.3861 1.21065C11.7472 0.929784 12.2528 0.929784 12.6139 1.21065L21.6139 8.21065C21.8575 8.4001 22 8.69141 22 9V20.5C22 21.3284 21.3284 22 20.5 22H15V14C15 13.4477 14.5523 13 14 13H10C9.44772 13 9 13.4477 9 14V22H3.5C2.67157 22 2 21.3284 2 20.5V9C2 8.69141 2.14247 8.4001 2.38606 8.21065L11.3861 1.21065Z" fill="white"/> </svg>);
  const walletSvg = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.6472 4.2755C18.3543 3.89891 19.8891 3.97968 20.8292 4.10203C20.8592 4.10592 20.8911 4.11927 20.9256 4.16303C20.9637 4.21127 21 4.29459 21 4.40561V17.5662C21 17.8531 20.7538 18.0756 20.4978 18.0671C19.2792 18.027 17.4886 18.0635 15.7992 18.4717C14.6384 18.7522 13.7101 19.2206 13 19.7021V6.46564C13 6.22541 13.0548 6.10361 13.0945 6.05233C13.2183 5.89268 13.5973 5.55172 14.2498 5.18356C14.8798 4.82813 15.7 4.48446 16.6472 4.2755ZM21.0873 2.11876C19.9976 1.97693 18.2169 1.88113 16.2164 2.32246C15.0613 2.57728 14.0561 2.99648 13.2671 3.44169C12.5005 3.87417 11.8669 4.37162 11.514 4.82683C11.1078 5.35069 11 5.96564 11 6.46564V22C11 22.4411 11.289 22.83 11.7112 22.9574C12.1314 23.0841 12.5849 22.922 12.8297 22.5583L12.8315 22.5555L12.8304 22.5572L12.8297 22.5583C12.8297 22.5583 12.831 22.5564 12.8322 22.5546C12.8365 22.5485 12.8455 22.536 12.8591 22.5178C12.8864 22.4814 12.9324 22.4224 12.9974 22.3467C13.1277 22.195 13.3329 21.9779 13.6163 21.7398C14.1824 21.2641 15.0549 20.7091 16.269 20.4158C17.7048 20.0688 19.2899 20.0284 20.4319 20.066C21.8117 20.1115 23 18.9895 23 17.5662V4.40561C23 3.34931 22.2946 2.27587 21.0873 2.11876Z" fill="white"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M7.35275 4.2755C5.64572 3.89891 4.11089 3.97968 3.17076 4.10203C3.14084 4.10592 3.10885 4.11927 3.07437 4.16303C3.03635 4.21127 3 4.29459 3 4.40561V17.5662C3 17.8531 3.24619 18.0756 3.50221 18.0671C4.72076 18.027 6.51143 18.0635 8.20077 18.4717C9.36161 18.7522 10.2899 19.2206 11 19.7021V6.46564C11 6.22541 10.9452 6.10361 10.9055 6.05233C10.7817 5.89268 10.4027 5.55172 9.75015 5.18356C9.12019 4.82813 8.29995 4.48446 7.35275 4.2755ZM2.91265 2.11876C4.00241 1.97693 5.78311 1.88113 7.78361 2.32246C8.9387 2.57728 9.94388 2.99648 10.7329 3.44169C11.4995 3.87417 12.1331 4.37162 12.486 4.82683C12.8922 5.35069 13 5.96564 13 6.46564V22C13 22.4411 12.711 22.83 12.2888 22.9574C11.8686 23.0841 11.4151 22.922 11.1703 22.5583L11.1685 22.5555L11.1696 22.5572L11.1703 22.5583C11.1703 22.5583 11.169 22.5564 11.1678 22.5546C11.1635 22.5485 11.1545 22.536 11.1409 22.5178C11.1136 22.4814 11.0676 22.4224 11.0026 22.3467C10.8723 22.195 10.6671 21.9779 10.3837 21.7398C9.81759 21.2641 8.94511 20.7091 7.73105 20.4158C6.2952 20.0688 4.71011 20.0284 3.56807 20.066C2.18834 20.1115 1 18.9895 1 17.5662V4.40561C1 3.34931 1.70543 2.27587 2.91265 2.11876Z" fill="white"/> </svg>);
  const activeWallet = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.063 21.7917C10.3894 22.1483 11 21.9534 11 21.4699V4C10 3 8.91255 2.57151 7.78361 2.32246C5.78311 1.88113 4.0024 1.97693 2.91265 2.11876C1.70543 2.27587 1 3.34931 1 4.40561V17.5662C1 18.9895 2.18834 20.1115 3.56807 20.066C4.71011 20.0284 6.2952 20.0688 7.73105 20.4158C8.82596 20.6803 9.52237 21.2009 10.063 21.7917Z" fill="white"/> <path d="M13.937 21.7917C13.6106 22.1483 13 21.9534 13 21.4699V4C14 3 15.0874 2.57151 16.2164 2.32246C18.2169 1.88113 19.9976 1.97693 21.0873 2.11876C22.2946 2.27587 23 3.34931 23 4.40561V17.5662C23 18.9895 21.8117 20.1115 20.4319 20.066C19.2899 20.0284 17.7048 20.0688 16.269 20.4158C15.174 20.6803 14.4776 21.2009 13.937 21.7917Z" fill="white"/> </svg>);
  const shopSvg = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M1 1C0.447715 1 0 1.44772 0 2C0 2.55228 0.447715 3 1 3H3.20647L5.98522 14.9089C6.39883 16.6816 7.95486 17.9464 9.76471 17.9983V18H17.5874C19.5362 18 21.2014 16.5956 21.5301 14.6747L22.7857 7.33734C22.9947 6.11571 22.0537 5 20.8143 5H5.72686L4.97384 1.77277C4.86824 1.32018 4.46475 1 4 1H1ZM6.19353 7L7.9329 14.4545C8.14411 15.3596 8.95109 16 9.88058 16H17.5874C18.5618 16 19.3944 15.2978 19.5588 14.3373L20.8143 7H6.19353Z" fill="white"/> <path d="M8 23C9.10457 23 10 22.1046 10 21C10 19.8954 9.10457 19 8 19C6.89543 19 6 19.8954 6 21C6 22.1046 6.89543 23 8 23Z" fill="white"/> <path d="M19 23C20.1046 23 21 22.1046 21 21C21 19.8954 20.1046 19 19 19C17.8954 19 17 19.8954 17 21C17 22.1046 17.8954 23 19 23Z" fill="white"/> </svg>);
  const activeShop = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M4 0.75H1C0.447715 0.75 0 1.19772 0 1.75V2.25C0 2.80228 0.447715 3.25 1 3.25H3.0119L5.73626 14.7312C6.18267 16.6125 7.84065 17.9508 9.76471 17.9987V18H17.5874C19.5362 18 21.2014 16.5956 21.5301 14.6747L22.7857 7.33734C22.9947 6.11571 22.0537 5 20.8143 5H5.99657L5.21623 1.7114C5.08251 1.14787 4.57918 0.75 4 0.75Z" fill="white"/> <path d="M10 21C10 22.1046 9.10457 23 8 23C6.89543 23 6 22.1046 6 21C6 19.8954 6.89543 19 8 19C9.10457 19 10 19.8954 10 21Z" fill="white"/> <path d="M21 21C21 22.1046 20.1046 23 19 23C17.8954 23 17 22.1046 17 21C17 19.8954 17.8954 19 19 19C20.1046 19 21 19.8954 21 21Z" fill="white"/> </svg>);
  const newsSvg = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C8.96243 1 6.5 3.46243 6.5 6.5C6.5 9.53757 8.96243 12 12 12C15.0376 12 17.5 9.53757 17.5 6.5C17.5 3.46243 15.0376 1 12 1ZM8.5 6.5C8.5 4.567 10.067 3 12 3C13.933 3 15.5 4.567 15.5 6.5C15.5 8.433 13.933 10 12 10C10.067 10 8.5 8.433 8.5 6.5Z" fill="white"/> <path d="M8 14C4.68629 14 2 16.6863 2 20V22C2 22.5523 2.44772 23 3 23C3.55228 23 4 22.5523 4 22V20C4 17.7909 5.79086 16 8 16H16C18.2091 16 20 17.7909 20 20V22C20 22.5523 20.4477 23 21 23C21.5523 23 22 22.5523 22 22V20C22 16.6863 19.3137 14 16 14H8Z" fill="white"/> </svg>);
  const activeNews = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 1C8.96243 1 6.5 3.46243 6.5 6.5C6.5 9.53757 8.96243 12 12 12C15.0376 12 17.5 9.53757 17.5 6.5C17.5 3.46243 15.0376 1 12 1Z" fill="white"/> <path d="M7 14C4.23858 14 2 16.2386 2 19V22C2 22.5523 2.44772 23 3 23H21C21.5523 23 22 22.5523 22 22V19C22 16.2386 19.7614 14 17 14H7Z" fill="white"/> </svg>);
  const settingsSvg = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1887 8.07626C17.3085 7.71693 17.215 7.32076 16.9471 7.05293C16.6793 6.7851 16.2831 6.69158 15.9238 6.81135L9.56381 8.93135C9.2652 9.03089 9.03089 9.2652 8.93135 9.56381L6.81135 15.9238C6.69158 16.2831 6.7851 16.6793 7.05293 16.9471C7.32076 17.215 7.71693 17.3085 8.07626 17.1887L14.4363 15.0687C14.7349 14.9692 14.9692 14.7349 15.0687 14.4363L17.1887 8.07626ZM9.34118 14.6589L10.6706 10.6706L14.6589 9.34118L13.3295 13.3295L9.34118 14.6589Z" fill="white"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" fill="white"/> </svg>);
  const activeSettings = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="white"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM17.1887 8.07625C17.3085 7.71692 17.215 7.32075 16.9471 7.05292C16.6793 6.78509 16.2831 6.69156 15.9238 6.81134L9.56381 8.93134C9.2652 9.03088 9.03089 9.26519 8.93135 9.5638L6.81135 15.9238C6.69158 16.2831 6.7851 16.6793 7.05293 16.9471C7.32076 17.215 7.71693 17.3085 8.07626 17.1887L14.4363 15.0687C14.7349 14.9692 14.9692 14.7349 15.0687 14.4363L17.1887 8.07625Z" fill="white"/> </svg>);


  const tabs = [
    { key: 'home', icon: homeSvg, activeIcon: activeHome }, 
    { key: 'marketplace', icon: shopSvg, activeIcon: activeShop },
    { key: 'news', icon: newsSvg, activeIcon: activeNews }
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
          return (
            <GetFlypPage
              onNavigate={setSubPage}
            />
          );
        } else if (subPage === 'deposit') {
          return <DepositPage onNavigate={setSubPage} />;
        }
        return <HomePage onNavigate={setSubPage} />;
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
        return (
          <GetFlypPage
            onNavigate={setSubPage}
          />
        );
      } else if (activeTab === 'marketplace') {
        return <MarketplacePage />;
      } else if (activeTab === 'settings') {
        return <MessagePage />;
      }

      return <div>Страница не найдена</div>;
    } catch (error) {
      console.error('Ошибка в renderContent:', error);
      return <div>Произошла ошибка при загрузке контента.</div>;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/messages/:userId" element={<SendMessage />} />
        <Route
          path="*"
          element={
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
                   <div className="icon">
                      {activeTab === tab.key ? tab.activeIcon : tab.icon}
                   </div>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
