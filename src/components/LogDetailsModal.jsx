import React from 'react';
import Modal from './Modal';

const LogDetailsModal = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  // Format the action string (e.g., "delete_user" -> "Delete User")
  const formatAction = (action) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get admin information with fallbacks
  const getAdminInfo = () => {
    if (log.adminId && typeof log.adminId === 'object') {
      return {
        name: log.adminId.name || 'Unknown',
        email: log.adminId.email || 'Unknown'
      };
    }
    return { name: 'Unknown', email: log.adminId || 'Unknown' };
  };

  const admin = getAdminInfo();

  // Check if this is an update operation with changes
  const hasChanges = log.action === 'update_user' && log.details && log.details.changes && log.details.changes.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Details"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Admin</h4>
            <p className="mt-1 text-lg font-semibold">{admin.name}</p>
            <p className="text-sm text-gray-600">{admin.email}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Action</h4>
            <p className="mt-1 text-lg font-semibold">{formatAction(log.action)}</p>
            <p className="text-sm text-gray-600">{formatDate(log.timestamp)}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">IP Address</h4>
            <p className="mt-1 text-lg font-semibold">{log.ipAddress}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Log ID</h4>
            <p className="mt-1 text-sm font-mono text-gray-600 break-all">{log._id}</p>
          </div>
        </div>

        {/* Target User Information */}
        {log.details && (log.details.userEmail || log.details.email) && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-700 mb-2">Target User</h4>
            <p className="text-md font-semibold">{log.details.userEmail || log.details.email}</p>
            {log.details.userId && (
              <p className="text-sm text-gray-600 font-mono mt-1">ID: {log.details.userId}</p>
            )}
          </div>
        )}

        {/* Changes Table for update operations */}
        {hasChanges && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-700 mb-3">Changes Made</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                      Field
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                      Old Value
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">
                      New Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-200">
                  {log.details.changes.map((change, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-yellow-100'}>
                      <td className="px-4 py-2 text-sm font-medium text-yellow-900">
                        {change.field}
                      </td>
                      <td className="px-4 py-2 text-sm text-yellow-700 font-mono">
                        {change.oldValue || <em>empty</em>}
                      </td>
                      <td className="px-4 py-2 text-sm text-yellow-700 font-mono">
                        {change.newValue || <em>empty</em>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Agent Information */}
        {log.userAgent && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Browser Info</h4>
            <p className="text-sm text-gray-600 break-all">{log.userAgent}</p>
          </div>
        )}

        {/* Details JSON Section */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">All Log Data</h4>
          <div className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm font-mono">
              {JSON.stringify(log, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LogDetailsModal; 