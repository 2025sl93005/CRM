import { useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function SolutionSection({ issueId, solution, onSolutionUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [solutionText, setSolutionText] = useState(solution || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!solutionText.trim()) {
      toast.error('Solution cannot be empty');
      return;
    }

    try {
      setIsSaving(true);
      const response = await axios.post(`/issues/${issueId}/solution`, {
        solution: solutionText
      });

      if (response.data.success) {
        toast.success('Solution submitted successfully! Customer has been notified via email.');
        setIsEditing(false);
        onSolutionUpdated();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit solution');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSolutionText(solution || '');
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Solution</h3>

      {!isEditing ? (
        <>
          {solution ? (
            <>
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{solution}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Solution
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No solution provided yet</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Solution
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <textarea
            value={solutionText}
            onChange={(e) => setSolutionText(e.target.value)}
            placeholder="Enter the solution for this issue..."
            rows="6"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-sm text-blue-800">✉️ Customer will be notified via email when you submit the solution</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? 'Submitting...' : 'Submit Solution'}
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
    </div>
  );
}
