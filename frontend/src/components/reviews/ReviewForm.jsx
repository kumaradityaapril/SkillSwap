import React, { useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const ReviewForm = ({ session, learnerId, mentorId, onReviewSubmitted, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      const response = await axios.post('/api/reviews', {
        sessionId: session._id,
        skill: session.skill._id, // Assuming session.skill is populated or has _id
        learner: learnerId,
        mentor: mentorId,
        rating,
        comment,
      });

      if (response.data.success) {
        setSuccess(true);
        // Optionally, clear form or close modal after a short delay
        setTimeout(() => {
          onReviewSubmitted();
        }, 1500);
      }

    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Reviewing {session.mentor?.name || 'Mentor'} for {session.skill?.title || 'Skill'}</h3>
      </div>
      
      {/* Rating Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={ratingValue}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  className="hidden"
                />
                <Star
                  className={
                    `cursor-pointer w-6 h-6 ${ratingValue <= rating ? 'text-yellow-500' : 'text-gray-300'}`
                  }
                  fill="currentColor"
                />
              </label>
            );
          })}
        </div>
        {rating === 0 && error && error.includes('rating') && (
             <p className="text-red-500 text-xs mt-1">Please select a rating.</p>
        )}
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comment</label>
        <textarea
          id="comment"
          rows="4"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
         {comment === '' && error && error.includes('comment') && (
             <p className="text-red-500 text-xs mt-1">Please provide a comment.</p>
        )}
      </div>

      {/* Submission Status */}
      {submitting && <p>Submitting review...</p>}
      {error && !success && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Review submitted successfully!</p>}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="btn-outline"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || rating === 0 || comment.trim() === ''}
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm; 