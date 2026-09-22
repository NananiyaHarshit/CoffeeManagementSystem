import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiUserCheck, FiMessageSquare } from 'react-icons/fi';
import { FaCoffee } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import { toast } from 'react-toastify';

const Chat = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChat = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await api.get('/chat');
        setMessages(res.data.chat?.messages || []);
      } catch (err) {
        console.error('Fetch chat error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [user]);

  // Connect Socket.IO
  useEffect(() => {
    if (!user) return;
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_chat', user.id);
    });

    newSocket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const textToSend = inputText.trim();
      setInputText('');

      const res = await api.post('/chat/message', { text: textToSend });
      setMessages(res.data.chat?.messages || []);

      if (socket) {
        socket.emit('send_message', {
          userId: user.id,
          message: textToSend,
        });
      }
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  if (!user) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <FiMessageSquare className="mx-auto h-16 w-16 text-caramel mb-4" />
          <h2 className="heading-serif text-2xl font-bold text-dark-espresso">Brew Haven Support Desk</h2>
          <p className="text-xs text-coffee-brown/80 mt-2 mb-6">
            Please log in to initiate a live chat session with our coffee concierge team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream flex items-center justify-center">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl bg-white shadow-card border border-caramel/15 overflow-hidden flex flex-col h-[75vh]">
          {/* Top Header */}
          <div className="bg-dark-espresso text-cream p-4 sm:p-5 flex items-center justify-between border-b border-caramel/20">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-caramel text-cream shadow-sm">
                <FaCoffee className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-dark-espresso" />
              </div>
              <div>
                <h3 className="heading-serif text-base font-bold text-cream">Brew Haven Concierge</h3>
                <span className="text-[11px] text-caramel flex items-center gap-1 font-semibold">
                  <FiUserCheck className="h-3 w-3" /> Live Support Online
                </span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-cream/40">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-caramel border-t-transparent"></div>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-xs text-coffee-brown/70 italic">
                Start typing below to chat with our baristas!
              </p>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.senderRole === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[80%] sm:max-w-[65%] ${
                      isUser ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <span className="text-[10px] text-coffee-brown/70 mb-1 px-1 font-semibold">
                      {msg.senderName}
                    </span>
                    <div
                      className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-caramel text-cream rounded-tr-none'
                          : 'bg-white text-dark-espresso border border-caramel/15 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-coffee-brown/50 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-cream flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about roasts, subscriptions, or delivery status..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-full border border-caramel/30 bg-cream/50 px-5 py-3 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-caramel text-cream shadow-md transition-transform hover:bg-coffee-brown active:scale-95 disabled:opacity-40"
            >
              <FiSend className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
