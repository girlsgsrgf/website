import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SendMessage.css';

const SendMessage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null); // состояние для текущего пользователя
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/chat/messages/${userId}/`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
          setCurrentUserId(data.current_user_id);
        } else {
          setMessages([]);
          setCurrentUserId(null);
          console.warn('Данные с сервера не содержат массив сообщений:', data);
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке сообщений:', error);
        setMessages([]);
        setCurrentUserId(null);
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
      <button onClick={() => navigate('/messages')} className="back-button" >
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <path
      d="M8.70711 16.2929C9.09763 16.6834 9.09763 17.3166 8.70711 17.7071C8.31658 18.0976 7.68342 18.0976 7.29289 17.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L7.29289 6.29289C7.68342 5.90237 8.31658 5.90237 8.70711 6.29289C9.09763 6.68342 9.09763 7.31658 8.70711 7.70711L5.41421 11L21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13L5.41422 13L8.70711 16.2929Z"
      fill="black"
    />
  </svg>
</button>
      <div className="messages-box">
        {Array.isArray(messages) && currentUserId !== null ? (
          messages.map((m) => {
            const isOwn = m.sender_id === currentUserId;
            return (
              <div
                key={m.id}
                className={`message-wrapper ${isOwn ? 'own-wrapper' : 'received-wrapper'}`}
              >
                <div className="message-sender">
                  {!isOwn && (m.sender || `Пользователь`)}
                </div>
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
        <button onClick={handleSend}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.9438 3.33038C22.0707 2.96779 21.9787 2.56456 21.7071 2.29292C21.4354 2.02128 21.0322 1.92926 20.6696 2.05617L1.85999 8.63954C0.577721 9.08834 0.504876 10.8743 1.74631 11.426L9.24237 14.7576L12.574 22.2537C13.1257 23.4951 14.9117 23.4223 15.3605 22.14L21.9438 3.33038ZM9.77851 12.8073L3.71105 10.1106L19.37 4.63L13.8894 20.289L11.1927 14.2215L14.7071 10.7071C15.0976 10.3166 15.0976 9.68342 14.7071 9.29289C14.3166 8.90237 13.6834 8.90237 13.2929 9.29289L9.77851 12.8073Z" fill="black"/> </svg></button>
      </div>
    </div>
  );
};

export default SendMessage;
