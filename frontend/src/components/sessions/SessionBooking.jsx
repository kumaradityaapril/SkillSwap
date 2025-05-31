import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar as CalendarIcon, Clock, User, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import Calendar from './Calendar';
import { toast } from 'react-toastify';

// Helper function to ensure we always work with arrays
const safeArray = (data) => (Array.isArray(data) ? data : []);

// Time slots (30-minute intervals)
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const SessionBooking = ({ skillId, mentorId }) => {
  const { user = {}, triggerSessionBookedFlag } = useAuth() || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [sessionRequests, setSessionRequests] = useState([]);
  const [loading, setLoading] = useState({
    slots: false,
    requests: false,
    action: false
  });
  const [error, setError] = useState(null);

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDate || !mentorId) {
      console.log('No selected date or mentorId, skipping fetchAvailableSlots');
      setAvailableSlots([]);
      return;
    }

    setLoading(prev => ({ ...prev, slots: true }));
    setError(null);

    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const response = await api.get(`/mentors/${mentorId}/availability`, {
        params: { date: dateString }
      });
      
      const slots = safeArray(response?.data?.availableSlots);
      console.log('Available slots received:', slots);
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error in fetchAvailableSlots:', err);
      setAvailableSlots([]);
      const errorMessage = err.response?.data?.message || 'Failed to fetch available slots';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, slots: false }));
    }
  }, [selectedDate, mentorId]);

  const fetchSessionRequests = useCallback(async () => {
    setLoading(prev => ({ ...prev, requests: true }));
    setError(null);

    try {
      const response = await api.get('/users/me/sessions');
      const requests = safeArray(response?.data);
      console.log('Session requests received:', requests);
      setSessionRequests(requests);
    } catch (err) {
      console.error('Error in fetchSessionRequests:', err);
      setSessionRequests([]);
      const errorMessage = err.response?.data?.message || 'Failed to fetch session requests';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate, fetchAvailableSlots]);

  useEffect(() => {
    fetchSessionRequests();
  }, [fetchSessionRequests]);

  const handleSessionRequest = async (timeSlot) => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }

    if (!timeSlot || !mentorId || !skillId) {
      toast.error('Missing required information');
      return;
    }

    console.log('Attempting to book session for slot:', timeSlot);
    setLoading(prev => ({ ...prev, action: true }));
    setError(null);

    try {
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
      
      toast.success('Session request sent successfully!');
      await Promise.all([fetchSessionRequests(), fetchAvailableSlots()]);
      triggerSessionBookedFlag?.();
    } catch (err) {
      console.error('Error requesting session:', err);
      const errorMessage = err.response?.data?.message || 'Failed to request session';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleSessionResponse = async (sessionId, status) => {
    if (!sessionId) {
      toast.error('Invalid session ID');
      return;
    }
    
    setLoading(prev => ({ ...prev, action: true }));
    setError(null);
    
    try {
      await api.put(`/sessions/${sessionId}/respond`, { status });
      await Promise.all([fetchSessionRequests(), fetchAvailableSlots()]);
      toast.success(`Session ${status} successfully`);
    } catch (err) {
      console.error('Error updating session status:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update session status';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Available Time Slots
            {loading.slots && <span className="ml-2 text-sm text-gray-500">Loading...</span>}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {loading.slots ? (
              <div className="col-span-3 flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : (
              TIME_SLOTS.map(slot => {
                const isAvailable = availableSlots.includes(slot);
                const isDisabled = loading.action || !isAvailable;
                return (
                  <button
                    key={slot}
                    onClick={() => handleSessionRequest(slot)}
                    disabled={isDisabled}
                    className={`p-3 rounded-lg text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[60px] ${
                      isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                    }`}
                  >
                    <Clock className="w-4 h-4 mb-1" />
                    <span>{slot}</span>
                    {!isAvailable && (
                      <span className="text-xs mt-1 text-red-500">Booked</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Session Requests */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Session Requests
          {loading.requests && <span className="ml-2 text-sm text-gray-500">Loading...</span>}
        </h3>
        <div className="space-y-4">
          {loading.requests ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : safeArray(sessionRequests).length > 0 ? (
            safeArray(sessionRequests).map((request) => (
              <div
                key={request?.id || `request-${Math.random().toString(36).substr(2, 9)}`}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <User className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {request?.learnerName || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {request?.date} at {request?.time}
                    </p>
                    {request?.skillName && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Skill: {request.skillName}
                      </p>
                    )}
                  </div>
                </div>
                
                {user?.role === 'mentor' && request?.status === 'pending' ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSessionResponse(request.id, 'approved')}
                      disabled={loading.action}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      title="Approve"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleSessionResponse(request.id, 'rejected')}
                      disabled={loading.action}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      title="Reject"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : request?.status ? (
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      request.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : request.status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {request.status}
                  </span>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No session requests found.
            </p>
          )}
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