// HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Users, Calendar, Award, ChevronRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="overflow-hidden relative py-24 text-white bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
        <div className="absolute inset-0 opacity-10 bg-pattern dark:opacity-20"></div>
        <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-white rounded-full opacity-10 dark:bg-gray-700"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full opacity-10 dark:bg-gray-700"></div>
        
        <div className="container relative z-10 px-4 mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl animate-fadeIn">
            Share Skills, <span className="text-blue-200 dark:text-blue-300">Grow Together</span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl font-light md:text-2xl dark:text-gray-300">
            Connect with others to share knowledge, learn new skills, and build meaningful relationships.
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            <Link
              to="/register"
              className="flex gap-2 items-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-xl shadow-lg transition-all duration-300 transform hover:bg-blue-50 hover:shadow-xl hover:scale-105 dark:text-blue-100 dark:bg-blue-800 dark:hover:bg-blue-700"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/skills"
              className="flex gap-2 items-center px-8 py-4 text-lg font-bold text-white bg-transparent rounded-xl border-2 border-white transition-all duration-300 hover:bg-white hover:text-blue-600 dark:border-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Explore Skills <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">How It Works</h2>
            <div className="mx-auto mb-6 w-20 h-1 bg-blue-500 rounded-full"></div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">Our platform makes it easy to connect, learn, and grow with just three simple steps</p>
          </div>
          
          <div className="grid gap-10 md:grid-cols-3">
            <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-2 dark:bg-gray-700 dark:border-gray-600 dark:shadow-2xl">
              <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 text-2xl font-bold text-white bg-blue-600 rounded-full shadow-md">
                1
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Create Your Profile</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                Sign up and build your profile showcasing your skills, expertise, and what you're looking to learn.
              </p>
              <div className="mt-6 text-blue-600 dark:text-blue-400">
                <Users className="mx-auto w-10 h-10 opacity-70" />
              </div>
            </div>

            <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-2 dark:bg-gray-700 dark:border-gray-600 dark:shadow-2xl">
              <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 text-2xl font-bold text-white bg-blue-600 rounded-full shadow-md">
                2
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Connect with Others</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                Discover people with complementary skills or those who can teach you something new.
              </p>
              <div className="mt-6 text-blue-600 dark:text-blue-400">
                <Calendar className="mx-auto w-10 h-10 opacity-70" />
              </div>
            </div>

            <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-2 dark:bg-gray-700 dark:border-gray-600 dark:shadow-2xl">
              <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 text-2xl font-bold text-white bg-blue-600 rounded-full shadow-md">
                3
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Schedule Sessions</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                Book learning sessions, exchange knowledge, and track your progress as you grow.
              </p>
              <div className="mt-6 text-blue-600 dark:text-blue-400">
                <Award className="mx-auto w-10 h-10 opacity-70" />
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/register" className="inline-flex items-center font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Get started today <ChevronRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">Featured Skills</h2>
            <div className="mx-auto mb-6 w-20 h-1 bg-blue-500 rounded-full"></div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">Discover popular skills taught by our community members</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Skill Card 1 */}
            <div className="overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-2 dark:bg-gray-700 dark:shadow-2xl">
              <div className="flex overflow-hidden relative justify-center items-center h-48 bg-gradient-to-r from-blue-400 to-blue-600">
                <div className="absolute inset-0 bg-blue-600 opacity-20 pattern-dots dark:opacity-30"></div>
                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full dark:text-blue-200 dark:bg-blue-900">Technology</span>
                  <div className="flex items-center px-2 py-1 bg-gray-50 rounded-full dark:bg-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">4.8</span>
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-800 dark:text-white">Web Development</h3>
                <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">Learn modern web development techniques from experienced developers.</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-600">
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="mr-1 w-4 h-4" /> 120 learners
                  </span>
                  <Link to="/skills/web-development" className="flex items-center font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Learn more <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Skill Card 2 */}
            <div className="overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-2 dark:bg-gray-700 dark:shadow-2xl">
              <div className="flex overflow-hidden relative justify-center items-center h-48 bg-gradient-to-r from-green-400 to-green-600">
                <div className="absolute inset-0 bg-green-600 opacity-20 pattern-dots dark:opacity-30"></div>
                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full dark:text-green-200 dark:bg-green-900">Finance</span>
                  <div className="flex items-center px-2 py-1 bg-gray-50 rounded-full dark:bg-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">4.6</span>
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-800 dark:text-white">Financial Planning</h3>
                <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">Master the basics of personal finance and investment strategies.</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-600">
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="mr-1 w-4 h-4" /> 85 learners
                  </span>
                  <Link to="/skills/financial-planning" className="flex items-center font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Learn more <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Skill Card 3 */}
            <div className="overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-2 dark:bg-gray-700 dark:shadow-2xl">
              <div className="flex overflow-hidden relative justify-center items-center h-48 bg-gradient-to-r from-purple-400 to-purple-600">
                <div className="absolute inset-0 bg-purple-600 opacity-20 pattern-dots dark:opacity-30"></div>
                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                </svg>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full dark:text-purple-200 dark:bg-purple-900">Language</span>
                  <div className="flex items-center px-2 py-1 bg-gray-50 rounded-full dark:bg-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">4.9</span>
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-800 dark:text-white">Spanish Conversation</h3>
                <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">Practice Spanish with native speakers in a friendly environment.</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-600">
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="mr-1 w-4 h-4" /> 150 learners
                  </span>
                  <Link to="/skills/spanish-conversation" className="flex items-center font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Learn more <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/skills" className="inline-flex items-center px-8 py-4 font-bold text-white bg-blue-600 rounded-xl shadow-lg transition-all duration-300 transform hover:bg-blue-700 hover:shadow-xl hover:scale-105">
              View All Skills <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">What Our Users Say</h2>
            <div className="mx-auto mb-6 w-20 h-1 bg-blue-500 rounded-full"></div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">Hear from people who have transformed their skills through our platform</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="relative p-8 bg-gray-50 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-700 dark:shadow-2xl">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="p-3 text-white bg-blue-600 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center mb-6">
                <img
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt="User"
                  className="mr-4 w-16 h-16 rounded-full ring-4 ring-white shadow-md dark:ring-gray-600"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Emily Johnson</h3>
                  <p className="font-medium text-blue-600 dark:text-blue-400">Web Developer</p>
                </div>
              </div>
              <p className="mb-6 italic leading-relaxed text-gray-700 dark:text-gray-300">
                "I've been able to improve my coding skills significantly by connecting with experienced developers on this platform. The one-on-one sessions are incredibly valuable."
              </p>
              <div className="flex text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="relative p-8 bg-gray-50 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-700 dark:shadow-2xl">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="p-3 text-white bg-blue-600 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center mb-6">
                <img
                  src="https://randomuser.me/api/portraits/men/45.jpg"
                  alt="User"
                  className="mr-4 w-16 h-16 rounded-full ring-4 ring-white shadow-md dark:ring-gray-600"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">David Chen</h3>
                  <p className="font-medium text-blue-600 dark:text-blue-400">Marketing Specialist</p>
                </div>
              </div>
              <p className="mb-6 italic leading-relaxed text-gray-700 dark:text-gray-300">
                "The platform made it easy for me to find someone to help with my digital marketing strategy. I'm now implementing what I learned and seeing great results."
              </p>
              <div className="flex text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 text-gray-300" />
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="relative p-8 bg-gray-50 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-700 dark:shadow-2xl">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="p-3 text-white bg-blue-600 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center mb-6">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="User"
                  className="mr-4 w-16 h-16 rounded-full ring-4 ring-white shadow-md dark:ring-gray-600"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sophia Martinez</h3>
                  <p className="font-medium text-blue-600 dark:text-blue-400">Language Learner</p>
                </div>
              </div>
              <p className="mb-6 italic leading-relaxed text-gray-700 dark:text-gray-300">
                "I've been practicing Spanish with native speakers through this platform, and my conversation skills have improved dramatically. The community is so supportive."
              </p>
              <div className="flex text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="overflow-hidden relative py-24 text-white bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white rounded-full opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full opacity-10"></div>
        
        <div className="container relative z-10 px-4 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">Ready to Start Your Journey?</h2>
          <p className="mx-auto mb-10 max-w-3xl text-xl font-light md:text-2xl">
            Join our community today and start sharing your skills or learning from others.
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            <Link
              to="/register"
              className="flex gap-2 items-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-xl shadow-lg transition-all duration-300 transform hover:bg-blue-50 hover:shadow-xl hover:scale-105"
            >
              Sign Up Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/skills"
              className="flex gap-2 items-center px-8 py-4 text-lg font-bold text-white bg-transparent rounded-xl border-2 border-white transition-all duration-300 hover:bg-white hover:text-blue-600"
            >
              Browse Skills <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="flex justify-center mt-16 space-x-8">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">1000+</div>
              <div className="text-blue-200">Active Users</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">500+</div>
              <div className="text-blue-200">Skills Shared</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">5000+</div>
              <div className="text-blue-200">Sessions Completed</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default HomePage;