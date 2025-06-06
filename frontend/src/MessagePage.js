import React, { useEffect, useState, useRef } from 'react';

const MessagePage = ({ userId, onBack }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(userId || null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  // Получаем список пользователей
  useEffect(() => {
    fetch('/api/chat/users/')
      .then(res => res.json())
      .then(data => {
        if (data.users) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      })
      .catch(() => setUsers([]));
  }, []);

  // Получаем сообщения при выборе пользователя
  useEffect(() => {
    if (!selectedUserId) return;

    fetch(`/api/chat/messages/${selectedUserId}/`)
      .then(res => res.json())
      .then(data => {
        setMessages(data || []);
      })
      .catch(() => setMessages([]));
  }, [selectedUserId]);

  // Прокрутка вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Отправка сообщения
  const handleSend = () => {
    if (!message.trim() || !selectedUserId) return;

    const formData = new FormData();
    formData.append('receiver_id', selectedUserId);
    formData.append('content', message);

    fetch('/api/chat/send/', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'sent') {
          setMessages(prev => [...prev, data.message]);
          setMessage('');
        } else {
          console.error('Ошибка при отправке:', data.error);
        }
      })
      .catch(err => {
        console.error('Ошибка сети при отправке:', err);
      });
  };

  // Поиск пользователей
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      // При пустом поиске — загрузить всех пользователей
      fetch('/api/chat/users/')
        .then(res => res.json())
        .then(data => {
          setUsers(data.users || []);
        })
        .catch(() => setUsers([]));
      return;
    }

    fetch(`/api/chat/search/?q=${encodeURIComponent(value)}`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.results || []);
      })
      .catch(() => setUsers([]));
  };

  return (
    <div className="message-page" style={{ maxWidth: 600, margin: 'auto' }}>
      {!selectedUserId ? (
        <>
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={search}
            onChange={handleSearch}
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map((u) => (
              <li
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #ddd',
                }}
              >
                {u.username}
              </li>
            ))}
            {users.length === 0 && <li>Пользователи не найдены</li>}
          </ul>
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedUserId(null)}
            style={{ marginBottom: 10 }}
          >
            Назад
          </button>
          <div
            className="chat-box"
            style={{
              height: 400,
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: 10,
              marginBottom: 10,
              backgroundColor: '#fafafa',
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  margin: '10px 0',
                  padding: '6px 8px',
                  backgroundColor: '#fff',
                  borderRadius: 4,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                <strong>{m.sender}</strong>: {m.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="message-input" style={{ display: 'flex' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите сообщение"
              style={{ flexGrow: 1, padding: 8, marginRight: 6 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
            />
            <button onClick={handleSend}>Отправить</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagePage;
