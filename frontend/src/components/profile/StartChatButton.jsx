import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const StartChatButton = ({ userId, userName }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const handleStartChat = () => {
    if (isAuthenticated) {
      navigate(`/chat/${userId}`);
    } else {
      navigate('/login', { state: { from: `/chat/${userId}` } });
    }
  };

  return (
    <button
      onClick={handleStartChat}
      className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      Message {userName}
    </button>
  );
};

export default StartChatButton;