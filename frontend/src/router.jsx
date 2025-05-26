import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./components/home/HomePage";
import SkillsPage from "./pages/SkillsPage";
import SkillDetail from "./components/skills/SkillDetail";

// Lazy load components for better performance
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/skills",
        element: <SkillsPage />,
      },
      {
        path: "/skills/:id",
        element: <SkillDetail />,
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat/:userId",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
