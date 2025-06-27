import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MessagePage.css';

const MessagePage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/chat/users/')
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((error) => console.error('Ошибка загрузки пользователей:', error));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      fetchUsers();
      return;
    }

    const userId = localStorage.getItem('user_id');

    fetch(`/api/chat/search/?user_id=${userId}&q=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data) => setUsers(data.results || []))
      .catch((error) => console.error('Ошибка поиска:', error));
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
      <ul className="user-list">
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => navigate(`/messages/${user.id}`)}
            className="user-item"
          >
            {user.username}
          </li>
        ))}
        {users.length === 0 && <li className="no-users">No users found</li>}
      </ul>
    </div>
  );
};

export default MessagePage;
