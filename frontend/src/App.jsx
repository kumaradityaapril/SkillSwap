import { Outlet } from 'react-router-dom';
import Navbar from './components/navigation/Navbar';
import './App.css';

function App() {
  return (
    <div className="app-container flex flex-col min-h-screen">
      <Navbar />
      <main className="container px-4 py-8 mx-auto flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 font-heading">SkillTrae</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Connect, Learn, Grow</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400">
                Terms
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} SkillTrae. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
