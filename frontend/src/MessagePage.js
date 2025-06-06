import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

    fetch(`/api/chat/search/?q=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data) => setUsers(data.results || []))
      .catch((error) => console.error('Ошибка поиска:', error));
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 16 }}>
      <h2>Сообщения</h2>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Поиск пользователей..."
        style={{ width: '100%', padding: 8, marginBottom: 12 }}
      />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => navigate(`/messages/${user.id}`)}
            style={{
              cursor: 'pointer',
              padding: 10,
              borderBottom: '1px solid #ddd',
            }}
          >
            {user.username}
          </li>
        ))}
        {users.length === 0 && <li>Пользователи не найдены</li>}
      </ul>
    </div>
  );
};

export default MessagePage;
