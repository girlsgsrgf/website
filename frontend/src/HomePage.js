import React, { useState, useEffect, useRef } from 'react';
import './HomePage.css';

const generateUserId = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

const MAX_CLICKS = 500;
const COOLDOWN_MS = 30 * 60 * 1000; 

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
  const lastSentBalanceRef = useRef(balance);
  const [overallWealth, setOverallWealth] = useState(0);
  const [productsValue, setProductsValue] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState(() => {
  const stored = localStorage.getItem('cooldown_until');
  return stored ? parseInt(stored) : null;
});
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [clicks, setClicks] = useState(() => {
  const saved = localStorage.getItem('clicks');
  return saved ? parseInt(saved) : 0; });



  useEffect(() => {
    const url = new URL('https://flyup.help/get_user_wealth');
    url.searchParams.append('user_id', userId);

    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
      if (data.products_value !== undefined) {
        setProductsValue(data.products_value);
      }
      })
      .catch(err => console.error('Ошибка при получении общего состояния:', err));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem('balance', balance.toFixed(2));
  }, [balance]);

  useEffect(() => {
    const totalWealth = parseFloat(balance) + parseFloat(productsValue);
    setOverallWealth(+totalWealth.toFixed(2));
  }, [balance, productsValue]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (balance !== lastSentBalanceRef.current) {
        const url = new URL('https://flyup.help/save_balance');
        url.searchParams.append('user_id', userId);
        url.searchParams.append('balance', balance);

        fetch(url.toString())
          .then(res => res.json())
          .then(data => {
            console.log('✅ Баланс отправлен:', data);
            lastSentBalanceRef.current = balance;
          })
          .catch(err => console.error('❌ Ошибка при отправке баланса:', err));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [userId, balance]);

   useEffect(() => {
      if (!cooldownUntil) return;

      const interval = setInterval(() => {
        const now = Date.now();
        const diff = cooldownUntil - now;

        if (diff <= 0) {
          clearInterval(interval);
          setCooldownUntil(null);
          setClicks(0);
          localStorage.removeItem('cooldown_until'); // 🧹 Удаляем
        } else {
          setCooldownTimeLeft(diff);
        }
      }, 1000);

      return () => clearInterval(interval);
       }, [cooldownUntil]);


      // Обновляем баланс и клики при клике
    const handleClick = () => {
        if (cooldownUntil) return; // блокировка

        if (clicks >= MAX_CLICKS) {
          const until = Date.now() + COOLDOWN_MS;
          setCooldownUntil(until);
          localStorage.setItem('cooldown_until', until.toString());
          return;
        }

        setClicked(true);

        const newBalance = +(balance + 0.01).toFixed(2);
        setBalance(newBalance);
        setClicks(prev => prev + 1); // ← безопасное обновление

        const id = Date.now();
        setFloatingIncrements(prev => [...prev, id]);

        setTimeout(() => {
          setFloatingIncrements(prev => prev.filter(i => i !== id));
        }, 1000);

        setTimeout(() => setClicked(false), 200);
      };


    useEffect(() => {
      localStorage.setItem('clicks', clicks);
      }, [clicks]);


    // Функция форматирования времени в мин:сек
    const formatTime = (ms) => {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Рассчёт заполнения шкалы в процентах
    const progressPercent = Math.min(100, (clicks / MAX_CLICKS) * 100);

  return (
    <>
    <div className="main-page">
    <div className="card-container">
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <p className="heading_8264">MASTERCARD</p>

            <svg className="logo" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48">
              <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"></path>
              <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"></path>
              <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"></path>
            </svg>

            <svg className="chip" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50">
              <image
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOY
fEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSW
ekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GS
e0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOW
ekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bf
u3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWua
fUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1
lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrb
tnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOh
g0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU
/f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dE
orDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2Ng
GAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVg
OkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3d
I2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6a
lKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkI
JVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0F
qBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM
1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGm
BSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCET
amiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdC
S24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpj
cmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIw
MjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAy
LTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg=="
              />
            </svg>

            <svg className="contactless" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
              <image
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ
cwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IEzgIwaKTAAADDklEQVRYw+1XS0iUURQ+f5qPyjQf
lGRFEEFK76koKGxRbWyVVLSOgsCgwjZBJJYuKogSIoOonUK4q3U0WVBWFPZYiIE6kuArG3VGzK/F
fPeMM/MLt99/NuHdfPd888/57jn3nvsQWWj/VcMlvMMd5KRTogqx9iCdIjUUmcGR9ImUYowyP3xN
GQJoRLVaZ2DaZf8kyjEJALhI28ELioyiwC+Rc3QZwRYyO/DH51hQgWm6DMIh10KmD4u9O16K49it
VoPOAmcGAWWOepXIRScAoJZ2Frro8oN+EyTT6lWkkg6msZfMSR35QTJmjU0g15tIGSJ08ZZMJkJk
HpNZgSkyXosS13TkJpZ62mPIJvOSzC1bp8vRhhCakEk7G9/o4gmZdbpsTcKu0m63FbnBP9Qrc15z
bkbemfgNDtEOI8NO5L5O9VYyRYgmJayZ9nPaxZrSjW4+F6Uw9yQqIiIZwhp2huQTf6OIvCZyGM6g
DJBZbyXifJXr7FZjGXsdxADxI7HUJFB6iWvsIhFpkoiIiGTJfjJfiCuJg2ZEspq9EHGVpYgzKqwJ
qSAOEwuJQ/pxPvE3cYltJCLdxBLiSKKIE5HxJKcTRNeadxfhDiuYw44zVs1dxKwRk/uCxIiQkxKB
sSctRVAge9g1E15EHE6yRUaJecRxcWlukdRIbGFOSZCMWQA/iWauIP3slREHXPyliqBcrrD71Amz
Z+rD1Mt2Yr8TZc/UR4/YtFnbijnHi3UrN9vKQ9rPaJf867ZiaqDB+czeKYmd3pNa6fuI75MiC0uX
XSR5aEMf7s7a6r/PudVXkjFb/SsrCRfROk0Fx6+H1i9kkTGn/E1vEmt1m089fh+RKdQ5O+xNJPUi
cUIjO0Dm7HwvErEr0YxeibL1StSh37STafE4I7zcBdRq1DiOkdmlTJVnkQTBTS7X1FYyvfO4piaI
nKbDCDaT2anLudYXCRFsQBgAcIF2/Okwgvz5+Z4tsw118dzruvIvjhTB+HOuWy8UvovEH6beitBK
xDyxm9MmISKCWrzB7bSlaqGlsf0FC0gMjzTg6GgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDIt
MTNUMDg6MTk6NTYrMDA6MDCjlq7LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTEzVDA4OjE5
OjU2KzAwOjAw0ssWdwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0xM1QwODoxOTo1Nisw
MDowMIXeN6gAAAAASUVORK5CYII="
              />
            </svg>

            <p className="number">9750 2484 5209 6576</p>
            <p className="date_8264">$ {balance.toFixed(2)}</p>
            <p className="name">BRUCE WAYNE</p>

            <div className="card-balance">
              <div className="balance-label">Баланс:</div>
              <div className="balance-amount">${balance.toFixed(2)}</div>
            </div>
          </div>

          <div className="flip-card-back">
            <div className="strip"></div>
            <div className="mstrip"></div>
            <div className="sstrip">
              <p className="code">***</p>
            </div>
          </div>
        </div>
      </div>
        {/* Добавляем шкалу прогресса */}
      <div className="progress-bar-wrapper" style={{ marginTop: '20px', width: '340px', height: '13px', background: '#eee', borderRadius: '10px', overflow: 'hidden', fontFamily: "Inter"}}>
        <div
          className="progress-bar"
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: 'green',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      {cooldownUntil && (
        <div style={{ marginTop: '6px', color: 'red', fontWeight: 'bold', marginLeft: '10em' }}>
          Wait {formatTime(cooldownTimeLeft)}
        </div>
      )}
      </div>

      <div className="clicker-wrapper">
        <div className="info-cards-row">

<div class="card">
    <div class="title">
        <span>
            <svg width="20" fill="currentColor" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
                </path>
            </svg>
        </span>
        <p class="title-text">
            WEALTH
        </p>
    </div>
    <div class="data">
        <p>
            ${overallWealth.toFixed(2)}
        </p>
        
    </div>
</div>


<div class="card">
    <div class="title">
  <img
    src="icons/usdt.png"
    alt="USDT"
    width="25"
    height="25"
  />

        <p class="title-text">
            USDT
        </p>
    </div>
    <div class="data">
        <p>
            0 
        </p>
    </div>
</div>
</div>
<div className={`clicker-container ${clicked ? 'clicked' : ''}`} onClick={handleClick}>
  {/* Background SVG pattern */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="100%"
    width="100%"
    style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}
  >
    <defs>
      <pattern patternUnits="userSpaceOnUse" height="30" width="30" id="dottedGrid">
        <circle fill="rgba(0,0,0,0.15)" r="1" cy="2" cx="2" />
      </pattern>
    </defs>
    <rect fill="url(#dottedGrid)" height="100%" width="100%" />
  </svg>

  {/* Generate button */}
  <div className="button-wrap" style={{ position: 'relative', zIndex: 1 }}>
    <button>
      <span>Earn</span>
    </button>
    <div className="button-shadow"></div>
  </div>

  {/* Floating increment text */}
  {floatingIncrements.map(id => (
    <div key={id} className="floating-plus">+$0.01</div>
  ))}
</div>


        <div className="clicker-text">Click to earn!</div>
      </div>
    </div>
    </>
  );
};


export default HomePage;
