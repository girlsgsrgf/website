import React, { useEffect, useState } from 'react';
import './MarketPlacePage.css';

function MarketPlacePage() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ search: '', category: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.search) params.append('search', filter.search);
    if (filter.category) params.append('category', filter.category);

    fetch(`/api/products/?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        const uniqueCats = [...new Set(data.map(p => p.category))];
        setCategories(uniqueCats);
      });
  }, [filter]);

  const handleClick = (id) => {
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name'); // 👈 имя пользователя
    const url = `/buy/${id}/?user_id=${userId}&username=${encodeURIComponent(userName)}`;
    window.location.href = url;
  };

  return (
    <div className="marketplace-wrapper">
    <div class="cardloader">
      <div class="loader">
        <p>Buy</p>
        <div class="words">
          <span class="word">Cars</span>
          <span class="word">Houses</span>
          <span class="word">Watches</span>
          <span class="word">Clothes</span>
          <span class="word">and Sell</span>
        </div>
      </div>
    </div>


      <div className="marketplace-filters">
        <div className="marketplace-filter-group">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            placeholder="Search Products"
          />
        </div>
        <div className="marketplace-filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="marketplace-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card" onClick={() => handleClick(product.id)}>
              <img src={product.image} alt={product.title} className="product-image" />
              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <p className="product-title">{product.title}</p>
                <div className="product-price">
                  <sup>$</sup><span>{product.price}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div class="realloader">
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
              <div class="bar4"></div>
              <div class="bar5"></div>
              <div class="bar6"></div>
              <div class="bar7"></div>
              <div class="bar8"></div>
              <div class="bar9"></div>
              <div class="bar10"></div>
              <div class="bar11"></div>
              <div class="bar12"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketPlacePage;
