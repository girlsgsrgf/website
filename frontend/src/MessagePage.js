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
      .then(data => setUsers(data));
  }, []);

  // Получаем сообщения при выборе пользователя
  useEffect(() => {
    if (!selectedUserId) return;
    fetch(`/api/chat/messages/${selectedUserId}/`)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [selectedUserId]);

  // Прокрутка вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Отправка сообщения
  const handleSend = () => {
    if (!message.trim()) return;
    fetch('/api/chat/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ recipient_id: selectedUserId, content: message }),
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev, data]);
        setMessage('');
      });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    fetch(`/api/chat/search/?q=${value}`)
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  return (
    <div className="message-page">
      {!selectedUserId ? (
        <>
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={search}
            onChange={handleSearch}
          />
          <ul>
            {users.map((u) => (
              <li key={u.id} onClick={() => setSelectedUserId(u.id)}>
                {u.username}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedUserId(null)}>Назад</button>
          <div className="chat-box" style={{ height: '400px', overflowY: 'auto' }}>
            {messages.map((m) => (
              <div key={m.id} style={{ margin: '10px 0' }}>
                <strong>{m.sender}</strong>: {m.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="message-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите сообщение"
            />
            <button onClick={handleSend}>Отправить</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagePage;
