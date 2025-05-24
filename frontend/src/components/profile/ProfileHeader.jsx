import { useUser } from '../../context/UserContext';
import RoleSelector from '../ui/RoleSelector';

const ProfileHeader = () => {
  const { user, activeRole, changeRole } = useUser();

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <div className="relative h-40 bg-gradient-to-r from-primary-500 to-secondary-500">
        {/* Profile image */}
        <div className="absolute -bottom-16 left-6">
          <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white">
            <img 
              src={user.avatar === 'default-avatar.jpg' ? '/images/default-avatar.svg' : user.avatar} 
              alt={user.name} 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-20 pb-6 px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            
            {user.bio && (
              <p className="mt-2 text-gray-700 dark:text-gray-300">{user.bio}</p>
            )}
            
            <div className="mt-3 flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {activeRole === 'both' ? 'Learner & Mentor' : activeRole === 'learner' ? 'Learner' : 'Mentor'}
              </span>
              
              {user.location && (
                <span className="ml-3 text-gray-600 dark:text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {user.location}
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-6 md:mt-0">
            <RoleSelector 
              initialRole={activeRole} 
              onRoleChange={changeRole} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;