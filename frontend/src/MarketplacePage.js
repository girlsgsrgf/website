import React, { useEffect, useState } from 'react';
import './MarketPlacePage.css';

function MarketPlacePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleClick = (id) => {
    const userId = localStorage.getItem('user_id'); 
    window.location.href = `/buy/${id}/?user_id=${userId}`;
  };

  const leftColumn = products.filter((_, i) => i % 2 === 0);
  const rightColumn = products.filter((_, i) => i % 2 !== 0);

  return (
    <div className="marketplace-container">
      <h1 className="marketplace-title">Маркетплейс</h1>
      <div className="marketplace-columns">
        <div className="marketplace-column">
          {leftColumn.map(product => (
            <div
              key={product.id}
              onClick={() => handleClick(product.id)}
              className="marketplace-card"
            >
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>
                {product.description.length > 16
                  ? product.description.slice(0, 16) + '...'
                  : product.description}
              </p>
              <p className="price">${product.price}</p>
            </div>
          ))}
        </div>

        <div className="marketplace-column">
          {rightColumn.map(product => (
            <div
              key={product.id}
              onClick={() => handleClick(product.id)}
              className="marketplace-card"
            >
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>
                {product.description.length > 16
                  ? product.description.slice(0, 16) + '...'
                  : product.description}
              </p>
              <p className="price">${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketPlacePage;
