import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import io from 'socket.io-client';

// Create a context for chat management
const ChatContext = createContext();

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Chat provider component
export const ChatProvider = ({ children }) => {
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      // Use VITE_API_URL for socket connection
      const newSocket = io(import.meta.env.VITE_API_URL || 'https://skillswap-3-ko34.onrender.com');
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Set up socket event listeners
  useEffect(() => {
    if (socket && user) {
      // Join user's room for private messages
      socket.emit('join_room', user.id);

      socket.on('new_message', (message) => {
        console.log('New message received:', message);
        // Check if the new message is for the active conversation
        if (activeConversation && message.conversation === activeConversation._id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        } else {
          // Increment unread count for the relevant conversation
          setUnreadCounts(prevCounts => ({
            ...prevCounts,
            [message.conversation]: (prevCounts[message.conversation] || 0) + 1
          }));
        }
        // Potentially refetch conversations to update last message/timestamp
        fetchConversations();
      });

      socket.on('conversation_created', (conversation) => {
        console.log('New conversation created:', conversation);
        // Add the new conversation to the list if it involves the current user
        if (conversation.participants.includes(user.id)) {
           // Prevent duplicates if fetchConversations is also called
          setConversations(prevConversations => {
            if (!prevConversations.some(c => c._id === conversation._id)) {
              return [conversation, ...prevConversations];
            }
            return prevConversations;
          });
        }
      });

      return () => {
        socket.off('new_message');
        socket.off('conversation_created');
      };
    }
  }, [socket, user, activeConversation]); // Depend on socket, user, and activeConversation

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/conversations`);
      setConversations(response.data.data);
       // Initialize unread counts
       const initialUnreadCounts = {};
       response.data.data.forEach(conv => {
         initialUnreadCounts[conv._id] = conv.unreadCount || 0;
       });
       setUnreadCounts(initialUnreadCounts);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to fetch conversations.');
    } finally {
      setLoading(false);
    }
  }, [user]); // Depend on user

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations, user]); // Re-fetch when user changes or fetchConversations changes

  const selectConversation = useCallback(async (conversationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/conversations/${conversationId}`);
      setActiveConversation(response.data.data);
      setMessages(response.data.data.messages);
       // Mark messages as read for this conversation
      setUnreadCounts(prevCounts => ({
        ...prevCounts,
        [conversationId]: 0
      }));
       // Optional: Send a request to the backend to mark as read
       await axios.post(`/api/conversations/${conversationId}/mark-as-read`);

    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = async (content) => {
    if (!activeConversation || !user || !socket) return;
    try {
      const message = {
        conversation: activeConversation._id,
        sender: user.id,
        content: content,
        timestamp: new Date(),
      };
       // Emit message to the server
      socket.emit('send_message', message);

       // Optimistically update UI
       setMessages((prevMessages) => [...prevMessages, message]);

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message.');
    }
  };

  const startNewConversation = async (recipientId, skillId) => {
     if (!user) {
       setError('You must be logged in to start a conversation.');
       return;
     }
     setLoading(true);
     setError(null);
     try {
       const response = await axios.post('/api/conversations', {
         participants: [user.id, recipientId],
         skill: skillId
       });
       const newConversation = response.data.data;
        // Add the new conversation to the list and make it active
       setConversations(prevConversations => {
          // Avoid adding duplicates if the conversation already exists
         if (!prevConversations.some(c => c._id === newConversation._id)) {
           return [newConversation, ...prevConversations];
         }
         return prevConversations;
       });
       setActiveConversation(newConversation);
       setMessages(newConversation.messages || []);
        // Reset unread count for this new conversation
       setUnreadCounts(prevCounts => ({
         ...prevCounts,
         [newConversation._id]: 0
       }));

     } catch (err) {
       console.error('Error starting new conversation:', err);
        // Handle specific error if conversation already exists
       if (err.response && err.response.status === 409) { // Assuming 409 Conflict for existing conversation
         setError('A conversation with this user for this skill already exists.');
          // Optionally, find and select the existing conversation
          fetchConversations(); // Refetch to get the existing conversation
       } else {
          setError(err.response?.data?.message || 'Failed to start new conversation.');
       }
     } finally {
       setLoading(false);
     }
   };

   const markConversationAsRead = useCallback(async (conversationId) => {
     if (!user) return;
     try {
       await axios.post(`/api/conversations/${conversationId}/mark-as-read`);
        setUnreadCounts(prevCounts => ({
          ...prevCounts,
          [conversationId]: 0
        }));
     } catch (err) {
       console.error('Error marking conversation as read:', err);
        // Optionally handle error, but don't block UI
     }
   }, [user]); // Depend on user


  const value = {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    fetchConversations,
    selectConversation,
    sendMessage,
    startNewConversation,
    socket,
    unreadCounts,
    markConversationAsRead,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;