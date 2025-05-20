import React from 'react';
import Modal from './Modal';
import { isObjectEqual } from '../utils/compareObjects';

const UserLogDetailsModal = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  // Format the action string (e.g., "view_resume" -> "View Resume")
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

  // Get user information with fallbacks
  const getUserInfo = () => {
    if (log.userId && typeof log.userId === 'object') {
      return {
        name: log.userId.name || 'Anonymous',
        email: log.userId.email || 'Unknown'
      };
    }
    return { name: 'Anonymous User', email: log.userId || 'Unknown' };
  };

  const user = getUserInfo();

  // Check if this log has CV update related data
  const isCVUpdate = log.action === 'update_cv' && log.details;
  const hasCVName = isCVUpdate && log.details.cvName;
  const hasTimestamp = isCVUpdate && log.details.timestamp;
  const hasBeforeAfterUpdate = isCVUpdate && log.details.beforeUpdate && log.details.afterUpdate;

  // Check if this log has before/after data for comparison (update operations)
  const hasBeforeAfterData = log.action === 'update' && log.details && log.details.before && log.details.after;

  // Function to identify changes between two objects
  const getChanges = () => {
    if (!hasBeforeAfterData) return [];
    
    const before = log.details.before;
    const after = log.details.after;
    const changes = [];

    // Helper function to recursively find changes in nested objects
    const findChanges = (beforeObj, afterObj, path = '') => {
      // Handle case where either value is null/undefined
      if (!beforeObj || !afterObj) {
        if (beforeObj !== afterObj) {
          changes.push({
            path: path.slice(1) || 'root', // Remove leading dot
            oldValue: beforeObj,
            newValue: afterObj
          });
        }
        return;
      }

      // Handle primitive values
      if (typeof beforeObj !== 'object' || typeof afterObj !== 'object') {
        if (beforeObj !== afterObj) {
          changes.push({
            path: path.slice(1) || 'value', // Remove leading dot
            oldValue: beforeObj,
            newValue: afterObj
          });
        }
        return;
      }

      // Handle arrays differently
      if (Array.isArray(beforeObj) && Array.isArray(afterObj)) {
        // If arrays have different lengths, consider it a complete change
        if (beforeObj.length !== afterObj.length) {
          changes.push({
            path: path.slice(1) || 'array',
            oldValue: beforeObj,
            newValue: afterObj
          });
          return;
        }
        
        // Compare each element in arrays
        for (let i = 0; i < beforeObj.length; i++) {
          findChanges(beforeObj[i], afterObj[i], `${path}[${i}]`);
        }
        return;
      }

      // For objects, compare each property
      const allKeys = new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]);
      
      for (const key of allKeys) {
        // Special handling for MongoDB _id fields which can be objects or strings
        if (key === '_id' && beforeObj[key] && afterObj[key]) {
          const beforeId = typeof beforeObj[key] === 'object' ? beforeObj[key].toString() : beforeObj[key];
          const afterId = typeof afterObj[key] === 'object' ? afterObj[key].toString() : afterObj[key];
          
          if (beforeId !== afterId) {
            changes.push({
              path: `${path}.${key}`,
              oldValue: beforeId,
              newValue: afterId
            });
          }
          continue;
        }

        // Skip if values are equal
        if (isObjectEqual(beforeObj[key], afterObj[key])) continue;
        
        // If key exists in both objects and values are objects, recurse
        if (beforeObj[key] !== undefined && afterObj[key] !== undefined && 
            typeof beforeObj[key] === 'object' && typeof afterObj[key] === 'object' &&
            !Array.isArray(beforeObj[key]) && !Array.isArray(afterObj[key])) {
          findChanges(beforeObj[key], afterObj[key], `${path}.${key}`);
        } else {
          // Otherwise record the change
          changes.push({
            path: (path ? path.slice(1) + '.' : '') + key,
            oldValue: beforeObj[key],
            newValue: afterObj[key]
          });
        }
      }
    };

    findChanges(before, after);
    return changes;
  };

  // Get changes if this is an update operation
  const changes = hasBeforeAfterData ? getChanges() : [];

  // Format complex values for display
  const formatValue = (value) => {
    if (value === undefined) return <em className="text-gray-400">undefined</em>;
    if (value === null) return <em className="text-gray-400">null</em>;
    if (value === '') return <em className="text-gray-400">empty string</em>;
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        if (value.length === 0) return <em className="text-gray-400">empty array</em>;
        
        return (
          <div className="font-mono text-xs overflow-x-auto">
            {JSON.stringify(value, null, 2)}
          </div>
        );
      }
      
      return (
        <div className="font-mono text-xs overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </div>
      );
    }
    
    return String(value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Log Details"
      maxWidth="max-w-5xl"
    >
      <div className="space-y-6">
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">User</h4>
            <p className="mt-1 text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Action</h4>
            <p className="mt-1 text-lg font-semibold">{formatAction(log.action)}</p>
            <p className="text-sm text-gray-600">{formatDate(log.timestamp)}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Resource</h4>
            <p className="mt-1 text-lg font-semibold">{log.resourceType || 'N/A'}</p>
            {log.resourceId && (
              <p className="text-sm text-gray-600 truncate">{log.resourceId}</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">IP Address</h4>
            <p className="mt-1 text-lg font-semibold">{log.ipAddress}</p>
            <p className="text-sm text-gray-600">Log ID: {log._id}</p>
          </div>
        </div>

        {/* CV Update Info Section */}
        {isCVUpdate && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-md font-medium text-blue-700">CV Information</h4>
                {hasCVName && (
                  <p className="text-sm font-semibold mt-1">{log.details.cvName}</p>
                )}
              </div>
              {hasTimestamp && (
                <div className="text-sm text-blue-600">
                  <span className="font-medium">Updated at:</span> {formatDate(log.details.timestamp)}
                </div>
              )}
            </div>

            {/* Side-by-side Before/After comparison */}
            {hasBeforeAfterUpdate && (
              <div className="mt-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-blue-800 mb-2 pb-1 border-b border-blue-200">Before Update</h5>
                    <div className="bg-white p-3 rounded shadow-sm overflow-auto max-h-96">
                      <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
                        {JSON.stringify(log.details.beforeUpdate, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-blue-800 mb-2 pb-1 border-b border-blue-200">After Update</h5>
                    <div className="bg-white p-3 rounded shadow-sm overflow-auto max-h-96">
                      <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
                        {JSON.stringify(log.details.afterUpdate, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Changes Section for Update Operations */}
        {hasBeforeAfterData && changes.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-yellow-700 mb-3">Changes Made</h4>
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
                  {changes.map((change, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-yellow-100'}>
                      <td className="px-4 py-2 text-sm font-medium text-yellow-900">
                        {change.path}
                      </td>
                      <td className="px-4 py-2 text-sm text-yellow-700">
                        {formatValue(change.oldValue)}
                      </td>
                      <td className="px-4 py-2 text-sm text-yellow-700">
                        {formatValue(change.newValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Additional Details Section */}
        {log.details && Object.keys(log.details).length > 0 && 
         !hasBeforeAfterData && !isCVUpdate && // Don't show this section if we're already showing the changes table or CV Update
         (
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Additional Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(log.details).map(([key, value]) => (
                <div key={key} className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</h5>
                  <p className="mt-1 text-sm text-gray-600 break-words">
                    {typeof value === 'object' 
                      ? JSON.stringify(value) 
                      : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Browser/Device Info Section */}
        {log.userAgent && (
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Browser Information</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{log.userAgent}</p>
            </div>
          </div>
        )}

        {/* Full JSON Data Section */}
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

export default UserLogDetailsModal; 