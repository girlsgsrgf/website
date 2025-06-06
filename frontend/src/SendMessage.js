// SendMessage.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SendMessage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/chat/messages/${userId}/`)
      .then(res => res.json())
      .then(data => setMessages(data || []))
      .catch(() => setMessages([]));
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const formData = new FormData();
    formData.append('receiver_id', userId);
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
        }
      });
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <button onClick={() => navigate('/messages')} style={{ marginBottom: 10 }}>
        Назад
      </button>
      <div style={{
        height: 400,
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fafafa',
      }}>
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
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение"
          style={{ flexGrow: 1, padding: 8, marginRight: 6 }}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );
};

export default SendMessage;
