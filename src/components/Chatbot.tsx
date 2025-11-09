import React, { useState, useRef, useEffect } from 'react';
import { MessageCircleIcon, XIcon, SendIcon, BotIcon, UserIcon } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const botResponses: { [key: string]: string } = {
  'shipping': 'We offer free shipping on all orders! Standard delivery takes 3-5 business days, while express delivery is available within 1-2 business days for an additional fee.',
  'return': 'We have a 30-day return policy. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund. The item must be in its original condition.',
  'warranty': 'All our products come with a 1-year manufacturer warranty. This covers any defects in materials or workmanship.',
  'payment': 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All transactions are secure and encrypted.',
  'track': 'You can track your order by visiting the Orders page in your account. You\'ll find a tracking number for each shipped order.',
  'discount': 'Sign up for our newsletter to receive exclusive discounts and early access to sales! We also offer student discounts and seasonal promotions.',
  'support': 'Our customer support team is available 24/7. You can reach us through this chat, email at support@techhub.com, or call us at 1-800-TECH-HUB.',
  'default': 'I\'m here to help! You can ask me about shipping, returns, warranty, payment methods, order tracking, discounts, or general support. How can I assist you today?'
};

const initialBotMessage: Message = {
  id: 1,
  text: 'Hello! I\'m your TechHub assistant. How can I help you today? You can ask me about shipping, returns, warranty, payments, or anything else!',
  sender: 'bot',
  timestamp: new Date()
};

const quickActions = [
  { label: '📦 Shipping Info', query: 'shipping' },
  { label: '↩️ Returns', query: 'return' },
  { label: '🛡️ Warranty', query: 'warranty' },
  { label: '💳 Payment', query: 'payment' },
  { label: '📍 Track Order', query: 'track' },
  { label: '💰 Discounts', query: 'discount' }
];

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
        return [initialBotMessage];
      }
    }
    return [initialBotMessage];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you today?';
    }
    
    if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }
    
    if (lowerMessage.includes('product') || lowerMessage.includes('item')) {
      return 'We have a wide range of electronics including smartphones, laptops, tablets, smartwatches, and accessories. You can browse our full catalog on the Shop page!';
    }
    
    return botResponses.default;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowQuickActions(false);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([initialBotMessage]);
      setShowQuickActions(true);
      localStorage.removeItem('chatMessages');
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 animate-pulse"
          aria-label="Open chat"
        >
          <MessageCircleIcon className="w-6 h-6" />
          {messages.length > 1 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Math.min(messages.length - 1, 9)}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col">
          <div className="bg-indigo-600 text-white rounded-t-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <BotIcon className="w-6 h-6" />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-white"></span>
              </div>
              <div>
                <h3 className="font-semibold">TechHub Assistant</h3>
                <p className="text-xs text-indigo-100">Online • Typically replies instantly</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="hover:bg-indigo-700 rounded-full p-1 text-xs"
                title="Clear chat"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-indigo-700 rounded-full p-1"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && (
                      <BotIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <UserIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <BotIcon className="w-5 h-5" />
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {showQuickActions && messages.length <= 2 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Quick Questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.query}
                      onClick={() => handleQuickAction(action.query)}
                      className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 transition-colors"
                disabled={!inputMessage.trim()}
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
