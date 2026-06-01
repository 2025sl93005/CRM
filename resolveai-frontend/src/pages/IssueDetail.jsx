import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import IssueHeader from './IssueDetail/IssueHeader';
import StatusTracker from './IssueDetail/StatusTracker';
import AssignedCsrSection from './IssueDetail/AssignedCsrSection';
import CommentsThread from './IssueDetail/CommentsThread';
import ActivityTimeline from './IssueDetail/ActivityTimeline';
import SolutionSection from './IssueDetail/SolutionSection';
import ManagerNotesSection from './IssueDetail/ManagerNotesSection';

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIssueDetail();
  }, [id]);

  const fetchIssueDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/issues/${id}/detail`);
      if (response.data.success) {
        setIssue(response.data.data);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load issue details');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = () => {
    fetchIssueDetail();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-gray-600">Issue not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Simplified view for CSR and Manager (no full details, just key info + comments)
  const isSimplifiedView = user?.role === 'CSR' || user?.role === 'MANAGER';

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Back
      </button>

      {isSimplifiedView ? (
        // Simplified layout for CSR/Manager
        <div className="space-y-6">
          {/* Issue Header - Simplified */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">{issue.issueTitle}</h1>
                <p className="text-gray-500 text-sm mt-1">Ticket #{issue.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${{
                'OPEN': 'bg-yellow-100 text-yellow-800',
                'ASSIGNED': 'bg-blue-100 text-blue-800',
                'IN_PROGRESS': 'bg-purple-100 text-purple-800',
                'ESCALATED': 'bg-red-100 text-red-800',
                'RESOLVED': 'bg-green-100 text-green-800',
                'CLOSED': 'bg-gray-100 text-gray-800'
              }[issue.status] || 'bg-gray-100 text-gray-800'}`}>
                {issue.status?.replace('_', ' ')}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{issue.issueDescription}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Issue Type</p>
                <p className="font-semibold">{issue.issueType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold">{issue.status?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p className="font-semibold">{issue.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created On</p>
                <p className="font-semibold text-sm">{new Date(issue.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Assigned To</p>
              <p className="font-semibold">{issue.assignedCsrName || 'Unassigned'}</p>
            </div>
          </div>

          {/* Solution Section for CSR */}
          {user?.role === 'CSR' && (
            <SolutionSection 
              issueId={issue.id}
              solution={issue.solution}
              onSolutionUpdated={handleCommentAdded}
            />
          )}

          {/* Manager Notes Section for Manager on escalated issues */}
          {user?.role === 'MANAGER' && (
            <ManagerNotesSection
              issueId={issue.id}
              managerNotes={issue.managerNotes}
              escalationReason={issue.escalationReason}
              isEscalated={issue.status === 'ESCALATED'}
              onNotesUpdated={handleCommentAdded}
            />
          )}

          {/* Comments Section */}
          <CommentsThread
            issueId={issue.id}
            user={user}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      ) : (
        // Full layout for Customer
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Issue Details */}
          <div className="col-span-2 space-y-6">
            <IssueHeader issue={issue} />
            <StatusTracker status={issue.status} />
            <CommentsThread
              issueId={issue.id}
              user={user}
              onCommentAdded={handleCommentAdded}
            />
            <ActivityTimeline activities={issue.activities} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <AssignedCsrSection
              assignedCsrId={issue.assignedCsrId}
              assignedCsrName={issue.assignedCsrName}
              assignedCsrEmail={issue.assignedCsrEmail}
            />
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Issue Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Comments</p>
                  <p className="text-2xl font-bold text-blue-600">{issue.commentCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Activities</p>
                  <p className="text-2xl font-bold text-green-600">{issue.activities?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
