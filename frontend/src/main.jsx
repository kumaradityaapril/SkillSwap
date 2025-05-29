import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import 'react-toastify';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <UserProvider>
          <ChatProvider>
            <RouterProvider 
              router={router} 
              future={{ v7_startTransition: true }}
            />
          </ChatProvider>
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
    <ToastContainer />
  </React.StrictMode>,
);
