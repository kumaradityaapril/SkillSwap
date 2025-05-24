import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useUser } from '../context/UserContext';
import { useParams, useNavigate } from 'react-router-dom';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    unreadCounts,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setActiveConversation
  } = useChat();

  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when userId changes
  useEffect(() => {
    if (userId) {
      fetchMessages(userId);
    } else if (conversations.length > 0) {
      // If no userId is provided, select the first conversation
      navigate(`/chat/${conversations[0].participants.find(p => p._id !== user.id)._id}`);
    }
  }, [userId, conversations, fetchMessages, navigate, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !userId) return;

    try {
      await sendMessage(userId, messageText);
      setMessageText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleConversationSelect = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (loading && !conversations.length) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      {/* Conversations sidebar */}
      <div className="w-1/4 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Messages</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No conversations yet
            </div>
          ) : (
            conversations.map((conversation) => {
              const otherUser = conversation.participants.find(p => p._id !== user.id);
              const isActive = activeConversation && 
                conversation.participants.some(p => p._id === userId);
              
              return (
                <div
                  key={conversation._id}
                  className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                  onClick={() => handleConversationSelect(otherUser._id)}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={otherUser.profilePicture || 'https://via.placeholder.com/40'}
                        alt={otherUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {otherUser.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {otherUser.name}
                        </h3>
                        {conversation.lastMessageDate && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(conversation.lastMessageDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {conversation.lastMessageText || 'No messages yet'}
                        </p>
                        {unreadCounts[conversation._id] > 0 && (
                          <span className="ml-2 bg-primary-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            {unreadCounts[conversation._id]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat header */}
            <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <div className="flex items-center">
                <img
                  src={activeConversation.participants.find(p => p._id !== user.id)?.profilePicture || 'https://via.placeholder.com/40'}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {activeConversation.participants.find(p => p._id !== user.id)?.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activeConversation.participants.find(p => p._id !== user.id)?.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              {messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.sender === user.id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="bg-primary-500 text-white px-4 py-2 rounded-r-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;