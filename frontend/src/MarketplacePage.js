import React, { useEffect, useState } from 'react';

function MarketPlacePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleClick = (id) => {
    window.location.href = `/buy/${id}/`;
  };

  // Разбиваем товары по индексам на две колонки
  const leftColumn = products.filter((_, i) => i % 2 === 0);
  const rightColumn = products.filter((_, i) => i % 2 !== 0);

  const cardStyle = {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '15px',
    marginBottom: '20px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: '#fff'
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Marketplace</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Левая колонка */}
        <div style={{ flex: 1 }}>
          {leftColumn.map(product => (
            <div
              key={product.id}
              onClick={() => handleClick(product.id)}
              style={cardStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src={product.image} alt={product.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
              <h3 style={{ color: "black"}}>{product.title}</h3>
              <p style={{ color: '#555', fontSize: '14px' }}>
                {product.description.length > 16
                  ? product.description.slice(0, 16) + '...'
                  : product.description}
              </p>
              <p style={{ fontWeight: 'bold', color: '#222', marginTop: '10px' }}>
                ${product.price}
              </p>
            </div>
          ))}
        </div>

        {/* Правая колонка */}
        <div style={{ flex: 1 }}>
          {rightColumn.map(product => (
            <div
              key={product.id}
              onClick={() => handleClick(product.id)}
              style={cardStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src={product.image} alt={product.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
              <h3 style={{ color: "black"}}>{product.title}</h3>
              <p style={{ color: '#555', fontSize: '14px' }}>
                {product.description.length > 16
                  ? product.description.slice(0, 16) + '...'
                  : product.description}
              </p>
              <p style={{ fontWeight: 'bold', color: '#222', marginTop: '10px' }}>
                ${product.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketPlacePage;
