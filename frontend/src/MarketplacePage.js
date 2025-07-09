import React, { useEffect, useState } from 'react';
import Select from 'react-select';
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
    const userRef = localStorage.getItem('ref'); // 👈 имя пользователя
    const url = `/buy/${id}/?user_id=${userId}&ref=${encodeURIComponent(userRef)}`;
    window.location.href = url;
  };

  const handleSearchChange = (e) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFilter({ ...filter, search: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No actual submit action needed, filtering happens on input change
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat, label: cat })),
  ];

  // Find selected option from filter.category (to control Select)
  const selectedCategoryOption = categoryOptions.find(opt => opt.value === filter.category) || categoryOptions[0];

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
          <form className="form" onSubmit={handleSubmit}>
          <button type="submit" aria-label="search">
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="search"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <input
            className="input"
            placeholder="Search"
            required
            type="text"
            value={filter.search}
            onChange={handleSearchChange}
          />

          <button className="reset" type="reset" onClick={handleReset} aria-label="reset search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
        <div className="marketplace-filter-group">
                    <Select
            options={categoryOptions}
            value={selectedCategoryOption}
            onChange={(selectedOption) => {
              setFilter(prev => ({ ...prev, category: selectedOption.value }));
            }}
            isClearable={false}
            isSearchable={false}
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                borderColor: 'black',
                boxShadow: state.isFocused ? '0 0 0 1px black' : null,
                '&:hover': {
                  borderColor: 'black',
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? 'black' : state.isFocused ? '#ddd' : 'white',
                color: state.isSelected ? 'white' : 'black',
                cursor: 'pointer',
              }),
              singleValue: (provided, state) => ({
                ...provided,
                color: 'black',
              }),
              menu: (provided) => ({
                ...provided,
                borderColor: 'black',
              }),
            }}
          />
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
