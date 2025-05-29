import React, { useState } from 'react';
import './DepositPage.css';

// Кастомный выпадающий список
function CustomDropdown({ options, selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="custom-dropdown">
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <img src={cryptoDetails[selected].icon} alt={selected} className="dropdown-icon" />
        <div className="dropdown-labels">
          <div className="symbol">{selected}</div>
          <div className="fullname">{cryptoDetails[selected].name}</div>
        </div>
        <span className="dropdown-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="dropdown-list">
          {options.map((opt) => (
            <div
              key={opt}
              className="dropdown-item"
              onClick={() => {
                onSelect(opt);
                setIsOpen(false);
              }}
            >
              <img src={cryptoDetails[opt].icon} alt={opt} className="dropdown-icon" />
              <div className="dropdown-labels">
                <div className="symbol">{opt}</div>
                <div className="fullname">{cryptoDetails[opt].name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


const cryptoOptions = {
  USDT: {
    TRC20: 'TVc5BJxZQ33VJ5NbrmqKR7JDpq3hmJnobH',
    ERC20: '0xc4a4cdf87c05bddb411edfeb89e208f84c5cf1ef',
    'BSC(BEP20)': '0xd28bc835db383735eeed8a23294028c81b18b4f0',
  },
  BTC: {
    Bitcoin: '1FMNgcizNzsDbyNEEjW96xBaEg1Vs3tF9h',
  },
};

const cryptoDetails = {
  USDT: {
    name: 'TetherUS',
    icon: '/icons/usdt.png',
  },
  BTC: {
    name: 'Bitcoin',
    icon: '/icons/btc.png',
  },
};


const networkOptions = {
  USDT: ['TRC20', 'ERC20', 'BSC(BEP20)'],
  BTC: ['Bitcoin'],
};

export default function DepositPage() {
  const [crypto, setCrypto] = useState('USDT');
  const [network, setNetwork] = useState('TRC20');

  const address = cryptoOptions[crypto][network];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      alert('Address copied to clipboard!');
    } catch (err) {
      // fallback method
      const textarea = document.createElement('textarea');
      textarea.value = address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Address copied (fallback method)!');
    }
  };

  return (
    <div className="deposit-container">
    <div className="logo-title">
      <img src="icons/wings.png" alt="Fly Up" className="header-img" />
    </div>
      <h2 className="page-title">Deposit</h2>

      <div className="select-box">
        <CustomDropdown
          options={Object.keys(cryptoOptions)}
          selected={crypto}
          onSelect={(value) => {
            setCrypto(value);
            setNetwork(networkOptions[value][0]);
          }}
        />
      </div>

      <div className="network-options">
        {networkOptions[crypto].map((net) => (
          <button
            key={net}
            className={`network-btn ${net === network ? 'active' : ''}`}
            onClick={() => setNetwork(net)}
          >
            {net}
          </button>
        ))}
      </div>

      <div className="warning">
        Make sure you also selected the same {crypto}, {network} network on the platform where you are withdrawing funds for this deposit. Otherwise you’ll lose your assets.
      </div>

      <div className="qr-section">
        <p className="qr-label">Deposit to</p>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`}
          alt="QR Code"
          className="qr-img"
        />
        <p className="address">{address}</p>
        <button className="copy-btn" onClick={handleCopy}>Copy
        </button>
        <p className="min-deposit">Minimum deposit: 10.00 USD</p>
      </div>

      <div className="notes">
        <strong>Notes:</strong>
        <ul>
          <li>Make sure the network is {crypto}-{network}. If you deposit via another network your assets may be lost.</li>
          <li>Deposits below the minimum amount will not be credited and cannot be refunded.</li>
        </ul>
      </div>
    </div>
  );
}
