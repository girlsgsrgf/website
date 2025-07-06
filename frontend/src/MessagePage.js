import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MessagePage.css';

const MessagePage = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchUsers = () => {
    const userId = localStorage.getItem('user_id');

    fetch(`/api/chat/users/?user_id=${userId}`)
      .then(res => res.json())
      .catch(err => console.error('Ошибка загрузки пользователей:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      fetchUsers();
      return;
    }

    const userId = localStorage.getItem('user_id');

    fetch(`/api/chat/search/?user_id=${userId}&q=${encodeURIComponent(value)}`)
      .then(res => res.json())
      .catch(err => console.error('Ошибка поиска:', err));
  };

  return (
    <div className="message-page">
      <h2 className="message-title">Messages</h2>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search users..."
        className="message-search"
      />
    </div>
  );
};

export default MessagePage;
