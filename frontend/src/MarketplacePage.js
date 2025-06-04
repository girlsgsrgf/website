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

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => handleClick(product.id)}
          style={{
            width: '45%',
            border: '1px solid #ccc',
            padding: '10px',
            cursor: 'pointer'
          }}
        >
          <img src={product.image} alt={product.title} style={{ width: '100%' }} />
          <h3>{product.title}</h3>
          <p>{product.description.slice(0, 50)}...</p>
          <p><strong>${product.price}</strong></p>
        </div>
      ))}
    </div>
  );
}

export default MarketPlacePage;
