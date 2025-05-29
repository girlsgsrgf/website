import React from 'react';
import './RoadMapPage.css';

const RoadMapPage = ({ onNavigate, balance }) => {
  return (
    <div className="main-page">
      <h2 className="app-title">Flyup Chain</h2>

      <div className="roadmap-section">
        <div className="roadmap-header">
          <div>
            <div className="roadmap-label">FLYP Roadmap</div>
            <div className="roadmap-link">A clear vision outlining our key milestones from launch to long-term growth and community rewards.</div>
          </div>
          <img src="/icons/roadmap.png" alt="logo" className="logo-image-roadmap" />
        </div>
      </div>

      <div className="roadmap-card-achieved">
      <div className="roadmap-title">Telegram Bot</div>       
      <div className="roadmap-subtitle">May 2025</div> 
      <img src="/icons/1roadmap.png" alt="dot" className="roadmap-img" />
      </div> 

      <div className="roadmap-card">
      <div className="roadmap-title">Web & Mobile App</div>       
      <div className="roadmap-subtitle">July 2025</div> 
      <img src="/icons/2roadmap.png" alt="dot" className="roadmap-img" />
      </div> 

      <div className="roadmap-card">
      <div className="roadmap-title">Launch $FLYP Coin</div>       
      <div className="roadmap-subtitle">December 2025</div> 
      <img src="/icons/3roadmap.png" alt="dot" className="roadmap-img" />
      </div> 

      <div className="roadmap-card">
      <div className="roadmap-title">Lamborghini & Dubai Giveaway</div>       
      <div className="roadmap-subtitle">January 2026</div> 
      <img src="/icons/4roadmap.png" alt="dot" className="roadmap-img" />
      </div> 

      <div className="roadmap-card">
      <div className="roadmap-title">Build the Community</div>       
      <div className="roadmap-subtitle">February 2026</div> 
      <img src="/icons/5roadmap.png" alt="dot" className="roadmap-img" />
      </div> 
     
    </div>
  );
};

export default RoadMapPage;
