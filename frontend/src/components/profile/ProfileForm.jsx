import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ProfileForm = () => {
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    bio: Yup.string()
      .max(500, 'Bio must be at most 500 characters'),
    skills: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one skill is required'),
    interests: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one interest is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/profile', values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-b-2 border-indigo-500 animate-spin" />
      </div>
    );
  }
  return (
    <div className="p-4 mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold">Profile Settings</h2>
      {userData && (
        <Formik
          initialValues={{
            name: userData.name || '',
            bio: userData.bio || '',
            skills: userData.skills || [],
            interests: userData.interests || []
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <Field
                  type="text"
                  name="name"
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <Field
                  as="textarea"
                  name="bio"
                  rows={4}
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <ErrorMessage name="bio" component="div" className="mt-1 text-sm text-red-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <Field
                  as="textarea"
                  name="bio"
                  rows={4}
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <ErrorMessage name="bio" component="div" className="mt-1 text-sm text-red-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills</label>
                <div className="mt-1">
                  {values.skills.map((skill, index) => (
                    <div key={index} className="flex items-center mb-2 space-x-2">
                      <Field
                        type="text"
                        name={`skills.${index}`}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSkills = values.skills.filter((_, i) => i !== index);
                          setFieldValue('skills', newSkills);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFieldValue('skills', [...values.skills, ''])}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Skill
                  </button>
                </div>
                <ErrorMessage name="skills" component="div" className="mt-1 text-sm text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Interests</label>
                <div className="mt-1">
                  {values.interests.map((interest, index) => (
                    <div key={index} className="flex items-center mb-2 space-x-2">
                      <Field
                        type="text"
                        name={`interests.${index}`}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newInterests = values.interests.filter((_, i) => i !== index);
                          setFieldValue('interests', newInterests);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFieldValue('interests', [...values.interests, ''])}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Interest
                  </button>
                </div>
                <ErrorMessage name="interests" component="div" className="mt-1 text-sm text-red-500" />
              </div>

              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex justify-center px-4 py-2 w-full text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ProfileForm;