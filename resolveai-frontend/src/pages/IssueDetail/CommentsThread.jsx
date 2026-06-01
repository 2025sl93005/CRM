import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function CommentsThread({ issueId, user, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [issueId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/comments/issue/${issueId}`);
      if (response.data.success) {
        setComments(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await axios.post('/comments', {
        issueId,
        message: newComment
      });

      if (response.data.success) {
        setNewComment('');
        await fetchComments();
        onCommentAdded?.();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'CUSTOMER':
        return 'bg-blue-100 text-blue-800';
      case 'CSR':
        return 'bg-green-100 text-green-800';
      case 'MANAGER':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">Discussion Thread</h3>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center mb-6">
          <p className="text-gray-600">No comments yet. Be the first to start the discussion!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-300 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {comment.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{comment.userName}</p>
                    <p className="text-xs text-gray-500">{comment.userEmail}</p>
                  </div>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getRoleColor(comment.userRole)}`}>
                    {comment.userRole?.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.message}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t pt-6">
        <h4 className="font-semibold text-gray-900 mb-3">Add Comment</h4>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="4"
          disabled={submitting}
        />

        <div className="mt-3 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setNewComment('')}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={submitting}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {submitting ? 'Sending...' : 'Send Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}
