import { useState, useRef, useEffect } from 'react';
import { MessageCircleIcon, XIcon, SendIcon, BotIcon, UserIcon } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  role?: 'user' | 'assistant';
}

const initialBotMessage: Message = {
  id: 1,
  text: 'Xin chào! Tôi là trợ lý tư vấn của TechHub. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi về sản phẩm, giao hàng, đổi trả, bảo hành, thanh toán hoặc bất kỳ thắc mắc nào!',
  sender: 'bot',
  timestamp: new Date(),
  role: 'assistant'
};

const quickActions = [
  { label: '📦 Thông tin giao hàng', query: 'Cho tôi biết về chính sách giao hàng' },
  { label: '↩️ Chính sách đổi trả', query: 'Chính sách đổi trả như thế nào?' },
  { label: '🛡️ Bảo hành', query: 'Sản phẩm được bảo hành bao lâu?' },
  { label: '💳 Thanh toán', query: 'Các hình thức thanh toán' },
  { label: '📱 Tư vấn sản phẩm', query: 'Tôi muốn tư vấn về điện thoại' },
  { label: '💰 Khuyến mãi', query: 'Có khuyến mãi gì không?' }
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

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      role: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowQuickActions(false);
    setIsTyping(true);

    try {
      const conversationHistory = [...messages, userMessage]
        .filter(msg => msg.role)
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.message,
        sender: 'bot',
        timestamp: new Date(),
        role: 'assistant'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Xin lỗi, đã có lỗi xảy ra khi kết nối với trợ lý AI. Vui lòng thử lại sau.',
        sender: 'bot',
        timestamp: new Date(),
        role: 'assistant'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
