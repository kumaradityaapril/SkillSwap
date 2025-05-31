import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar as CalendarIcon, Clock, User, Check, X, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import Calendar from './Calendar';
import { toast } from 'react-toastify';

const SessionBooking = ({ skillId, mentorId }) => {
  const { user, triggerSessionBookedFlag } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [sessionRequests, setSessionRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Time slots (30-minute intervals)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    console.log('useEffect in SessionBooking triggered. selectedDate:', selectedDate);
    if (selectedDate) {
      fetchAvailableSlots();
    }
    fetchSessionRequests();
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;
    console.log('Fetching available slots for date:', selectedDate.toISOString().split('T')[0], 'skillId:', skillId, 'mentorId:', mentorId);
    try {
      const response = await api.get(`/mentors/${mentorId}/availability`, {
        params: { date: selectedDate.toISOString().split('T')[0] }
      });
      console.log('Available slots fetched:', response.data);
      setAvailableSlots(response.data.availableSlots);
    } catch (err) {
      setError('Failed to fetch available slots');
    }
  };

  const fetchSessionRequests = async () => {
    try {
      const response = await api.get('/users/me/sessions');
      setSessionRequests(response.data);
    } catch (err) {
      setError('Failed to fetch session requests');
    }
  };

  const handleSessionRequest = async (timeSlot) => {
    console.log('Attempting to book session for slot:', timeSlot);
    try {
      setLoading(true);

      // Calculate endTime (assuming 30-minute sessions)
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(hours, minutes + 30, 0, 0);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      const requestBody = {
        skillId,
        mentorId,
        date: selectedDate.toISOString().split('T')[0],
        startTime: timeSlot,
        endTime: endTimeString,
      };
      console.log('Sending session request body:', requestBody);

      await api.post('/sessions', requestBody);

      console.log('Session request successful for slot:', timeSlot);
      toast.success('Session request sent successfully!');
      await fetchSessionRequests();
      setError(null);
      triggerSessionBookedFlag();
    } catch (err) {
      console.error('Error requesting session:', err);
      setError('Failed to request session');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionResponse = async (sessionId, status) => {
    try {
      setLoading(true);
      await api.put(`/sessions/${sessionId}/respond`, {
        status
      });
      await fetchSessionRequests();
      setError(null);
    } catch (err) {
      setError('Failed to update session status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book a Session</h2>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Select a date and time</span>
        </div>
      </div>

      {/* Calendar Component */}
      <Calendar
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
      />

      {/* Time Slots */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Time Slots</h3>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map(slot => {
              const isAvailable = availableSlots.includes(slot);
              const isDisabled = loading || !isAvailable;
              console.log(`Slot ${slot}: isAvailable=${isAvailable}, loading=${loading}, isDisabled=${isDisabled}`);
              return (
                <button
                  key={slot}
                  onClick={() => handleSessionRequest(slot)}
                  disabled={isDisabled}
                  className={`p-3 rounded-lg text-center transition-all duration-200 ${
                    isDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Session Requests */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Session Requests</h3>
        <div className="space-y-4">
          {sessionRequests.map(request => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {request.learnerName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {request.date} at {request.time}
                  </p>
                </div>
              </div>
              {user.role === 'mentor' && request.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSessionResponse(request.id, 'approved')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleSessionResponse(request.id, 'rejected')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              {request.status !== 'pending' && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  request.status === 'approved'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {request.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/50 rounded-lg flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SessionBooking; 