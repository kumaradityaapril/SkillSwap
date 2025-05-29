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
import SkillPostForm from "./pages/SkillPostForm";
import MySessionsPage from "./pages/MySessionsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

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
        path: "/my-sessions",
        element: (
          <ProtectedRoute>
            <MySessionsPage />
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
      {
        path: "/post-skill",
        element: (
          <ProtectedRoute allowedRoles={['mentor']}>
            <SkillPostForm />
          </ProtectedRoute>
        )
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
    ],
  },
]);

export default router;
