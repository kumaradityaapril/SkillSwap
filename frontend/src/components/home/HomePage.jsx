import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Share Skills, <span className="text-primary-600 dark:text-primary-400">Grow Together</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              SkillTrae connects people who want to learn with those who want to teach.
              Exchange knowledge, build connections, and grow your skills.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
              <Link to="/skills" className="btn-outline">
                Explore Skills
              </Link>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
              alt="People collaborating" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How SkillTrae Works</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform makes it easy to connect with others and share knowledge
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Sign up and list the skills you want to share or learn from others.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect with Others</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Browse skills and connect with people who match your interests.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Schedule Sessions</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Book sessions and start learning or teaching in a collaborative environment.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Skills</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover popular skills being shared on our platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card overflow-hidden transition-transform hover:scale-105">
              <img 
                src={`https://source.unsplash.com/random/300x200?skill=${item}`} 
                alt="Skill" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-secondary-100 text-secondary-800 rounded-full dark:bg-secondary-900 dark:text-secondary-200">
                    {['Technology', 'Art', 'Business'][item - 1]}
                  </span>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">4.8</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{['Web Development', 'Digital Painting', 'Marketing Strategy'][item - 1]}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {['Learn modern web development techniques with React and Node.js', 'Master digital painting techniques using Procreate and Photoshop', 'Develop effective marketing strategies for your business or product'][item - 1]}
                </p>
                <div className="flex items-center">
                  <img 
                    src={`https://randomuser.me/api/portraits/men/${20 + item}.jpg`} 
                    alt="Mentor" 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium">{['John Doe', 'Sarah Smith', 'Michael Johnson'][item - 1]}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">5 active sessions</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/skills" className="btn-primary">
            View All Skills
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from people who have used SkillTrae to learn and teach
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((item) => (
            <div key={item} className="card p-6">
              <div className="flex items-center mb-4">
                <img 
                  src={`https://randomuser.me/api/portraits/${item === 1 ? 'women' : 'men'}/${30 + item}.jpg`} 
                  alt="User" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{item === 1 ? 'Emily Johnson' : 'David Chen'}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item === 1 ? 'Learner' : 'Mentor'}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                {item === 1 
                  ? "I've learned so much through SkillTrae! The mentors are knowledgeable and supportive, and the platform makes it easy to schedule sessions that fit my busy schedule."
                  : "Teaching on SkillTrae has been a rewarding experience. I've connected with motivated learners and improved my own skills through teaching. The platform handles all the logistics so I can focus on sharing knowledge."}
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-600 dark:bg-primary-800 rounded-xl text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join our community today and start sharing your skills or learning from others.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Sign Up Now
            </Link>
            <Link to="/skills" className="btn border border-white text-white hover:bg-primary-700">
              Browse Skills
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}