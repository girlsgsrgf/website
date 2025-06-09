import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SendMessage.css';

const SendMessage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const currentUserId = 123; // заменить на реального пользователя

  useEffect(() => {
    fetch(`/api/chat/messages/${userId}/`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else {
          setMessages([]);
          console.warn('Данные с сервера не содержат массив сообщений:', data);
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке сообщений:', error);
        setMessages([]);
      });
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
        } else {
          console.warn('Сообщение не отправлено:', data);
        }
      })
      .catch(error => console.error('Ошибка отправки сообщения:', error));
  };

  return (
    <div className="chat-container">
      <button onClick={() => navigate('/messages')} className="back-button">
        Назад
      </button>
      <div className="messages-box">
        {Array.isArray(messages) ? (
          messages.map((m) => {
            const isOwn = m.is_own ?? (m.sender_id === currentUserId);
            return (
              <div
                key={m.id}
                className={`message-wrapper ${isOwn ? 'own-wrapper' : 'received-wrapper'}`}
              >
                {!isOwn && (
                  <div className="message-sender">
                    {m.sender_username || `Пользователь ${m.sender_id}`}
                  </div>
                )}
                <div
                  className={`message-bubble ${isOwn ? 'own-message' : 'received-message'}`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-messages">Нет сообщений</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );
};

export default SendMessage;
