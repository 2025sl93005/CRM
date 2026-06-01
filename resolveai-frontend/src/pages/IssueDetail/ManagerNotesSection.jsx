import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManagerNotesSection({ issueId, managerNotes, isEscalated, escalationReason, onNotesUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [notesText, setNotesText] = useState(managerNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [csrs, setCsrs] = useState([]);
  const [selectedCsr, setSelectedCsr] = useState('');
  const [isReassigning, setIsReassigning] = useState(false);

  useEffect(() => {
    if (showReassign) {
      fetchCsrs();
    }
  }, [showReassign]);

  const fetchCsrs = async () => {
    try {
      const response = await axios.get('/users/csr');
      if (response.data.success) {
        setCsrs(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load CSRs');
    }
  };

  if (!isEscalated) {
    return null;
  }

  const handleSave = async () => {
    if (!notesText.trim()) {
      toast.error('Notes cannot be empty');
      return;
    }

    try {
      setIsSaving(true);
      const response = await axios.post(`/issues/${issueId}/manager-notes`, {
        managerNotes: notesText
      });

      if (response.data.success) {
        toast.success('Manager notes submitted successfully! Customer has been notified via email.');
        setIsEditing(false);
        onNotesUpdated();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit notes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReassign = async () => {
    if (!selectedCsr) {
      toast.error('Please select a CSR');
      return;
    }

    try {
      setIsReassigning(true);
      const response = await axios.put(`/issues/${issueId}/assign`, {
        csrId: parseInt(selectedCsr)
      });

      if (response.data.success) {
        toast.success('Issue reassigned to CSR successfully');
        setShowReassign(false);
        setSelectedCsr('');
        onNotesUpdated();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reassign issue');
    } finally {
      setIsReassigning(false);
    }
  };

  const handleCancel = () => {
    setNotesText(managerNotes || '');
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>🔸 Manager Input</span>
        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Escalated Issue</span>
      </h3>

      {/* Escalation Reason Display */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Escalation Reason (from CSR)</h4>
        <p className="text-gray-700 whitespace-pre-wrap">{escalationReason || 'No reason provided'}</p>
      </div>

      {!isEditing ? (
        <>
          {managerNotes ? (
            <>
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{managerNotes}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Notes
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No manager input provided yet</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Add Manager Input
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Add your input, resolution, or guidance for this escalated issue..."
            rows="6"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4">
            <p className="text-sm text-orange-800">✉️ Customer will be notified via email when you submit your input</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {isSaving ? 'Submitting...' : 'Submit Input'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reassignment Section */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold mb-3">Reassign to CSR</h4>
        {!showReassign ? (
          <button
            onClick={() => setShowReassign(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Reassign Issue
          </button>
        ) : (
          <div className="space-y-3">
            <select
              value={selectedCsr}
              onChange={(e) => setSelectedCsr(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a CSR...</option>
              {csrs.map((csr) => (
                <option key={csr.id} value={csr.id}>
                  {csr.firstName} {csr.lastName} ({csr.email})
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleReassign}
                disabled={isReassigning || !selectedCsr}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isReassigning ? 'Reassigning...' : 'Confirm Reassign'}
              </button>
              <button
                onClick={() => {
                  setShowReassign(false);
                  setSelectedCsr('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
