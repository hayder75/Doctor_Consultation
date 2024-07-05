// src/pages/ChatPage.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useSelector((state) => state.user); 
  const socket = io('http://localhost:5000'); 

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      const doctorId = 'doctor1'; // i will replace with the actual doctor ID
      socket.emit('joinRoom', { userId: user._id, doctorId });
    });

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, user._id]);

  const sendMessage = () => {
    const roomId = `${user._id}-doctor1`;
    socket.emit('sendMessage', { roomId, message });
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage('');
  };

  return (
    <div>
      <h1>Chat</h1>
      <div id="messages" style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <div id="input" style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
