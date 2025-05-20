import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Search, Filter, ChevronDown, ChevronUp, Loader, Info } from "lucide-react"
import api from "../../utils/api"
import UserLogDetailsModal from "../../components/UserLogDetailsModal"

export default function UserLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState(null)
  const [sortField, setSortField] = useState("timestamp")
  const [sortDirection, setSortDirection] = useState("desc")
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLog, setSelectedLog] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1
  })

  // Fetch logs from API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const response = await api.get("/api/admin/users/all-logs", {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            sortBy: sortField,
            sortOrder: sortDirection
          }
        })

        setLogs(response.data.data)
        setPagination(response.data.pagination)
        setError(null)
      } catch (err) {
        console.error("Error fetching user logs:", err)
        setError("Failed to fetch user logs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [pagination.page, pagination.limit, sortField, sortDirection])

  // Get unique actions for filter dropdown
  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)))

  // Filter logs based on search term and action filter
  const filteredLogs = logs.filter((log) => {
    const userEmail = log.userId && typeof log.userId === 'object' ? log.userId.email : ""
    const userName = log.userId && typeof log.userId === 'object' ? log.userId.name : ""
    const actionName = log.action || ""
    const resourceType = log.resourceType || ""

    const matchesSearch =
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resourceType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterAction ? log.action === filterAction : true

    return matchesSearch && matchesFilter
  })

  const toggleSort = (field) => {
    if (field === sortField) {
      // If clicking the same column, toggle direction
      setSortDirection(prevDirection => (prevDirection === "asc" ? "desc" : "asc"));
    } else {
      // If clicking a new column, default to desc
      setSortField(field);
      setSortDirection("desc");
    }
  }

  // Open the details modal for a log
  const openLogDetailsModal = (log) => {
    setSelectedLog(log)
    setIsModalOpen(true)
  }

  // Close the details modal
  const closeLogDetailsModal = () => {
    setIsModalOpen(false)
    setSelectedLog(null)
  }

  // Format the timestamp to relative time (e.g., "2 hours ago")
  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (error) {
      return timestamp
    }
  }

  // Get badge color based on action type
  const getActionBadgeColor = (action) => {
    switch (action) {
      case "view":
        return "bg-blue-100 text-blue-800"
      case "create":
        return "bg-green-100 text-green-800"
      case "update":
        return "bg-yellow-100 text-yellow-800"
      case "delete":
        return "bg-red-100 text-red-800"
      case "download":
        return "bg-purple-100 text-purple-800"
      case "login":
        return "bg-indigo-100 text-indigo-800"
      case "signup":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format the action string (e.g., "delete_user" -> "Delete User")
  const formatAction = (action) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Helper to get a summary of changes for the main table
  const getChangeSummary = (log) => {
    if (log.action !== 'update' || !log.details || !log.details.before || !log.details.after) {
      return null;
    }

    // For personal info changes
    if (log.details.before.personalInfo && log.details.after.personalInfo) {
      const beforeInfo = log.details.before.personalInfo;
      const afterInfo = log.details.after.personalInfo;
      
      const changedFields = [];
      
      // Check each field in personalInfo for changes
      for (const key in afterInfo) {
        if (beforeInfo[key] !== afterInfo[key]) {
          changedFields.push(key);
        }
      }
      
      if (changedFields.length > 0) {
        return {
          section: 'Personal Info',
          fields: changedFields
        };
      }
    }
    
    // For top level property changes (like summary, name, etc.)
    const simpleProps = ['name', 'summary', 'status'];
    const changedSimpleProps = simpleProps.filter(prop => 
      log.details.before[prop] !== undefined && 
      log.details.after[prop] !== undefined && 
      log.details.before[prop] !== log.details.after[prop]
    );
    
    if (changedSimpleProps.length > 0) {
      return {
        section: 'Basic Info',
        fields: changedSimpleProps
      };
    }
    
    // For array collections (skills, education, experience, etc.)
    const arrayProps = ['education', 'experience', 'skills', 'projects', 'certifications', 'languages'];
    
    for (const prop of arrayProps) {
      const beforeArr = log.details.before[prop];
      const afterArr = log.details.after[prop];
      
      if (Array.isArray(beforeArr) && Array.isArray(afterArr)) {
        if (beforeArr.length !== afterArr.length) {
          return {
            section: prop.charAt(0).toUpperCase() + prop.slice(1),
            fields: [`${prop} count changed from ${beforeArr.length} to ${afterArr.length}`]
          };
        }
        
        // Check if array items have changed
        let hasChanges = false;
        for (let i = 0; i < beforeArr.length; i++) {
          if (JSON.stringify(beforeArr[i]) !== JSON.stringify(afterArr[i])) {
            hasChanges = true;
            break;
          }
        }
        
        if (hasChanges) {
          return {
            section: prop.charAt(0).toUpperCase() + prop.slice(1),
            fields: [`${prop} items modified`]
          };
        }
      }
    }
    
    // If we couldn't identify specific changes but we know there are changes
    if (JSON.stringify(log.details.before) !== JSON.stringify(log.details.after)) {
      return {
        section: 'Other',
        fields: ['Multiple fields changed']
      };
    }
    
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Activity Logs</h1>
          <p className="mt-2 text-sm text-gray-500">View all user actions performed in the system</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by user or action..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={filterAction || ""}
              onChange={(e) => setFilterAction(e.target.value || null)}
            >
              <option value="">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {formatAction(action)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-4 text-gray-600">Loading logs...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Resource
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("timestamp")}
                      >
                        <div className="flex items-center">
                          Time
                          {sortField === "timestamp" && (
                            sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            )
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        IP Address
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No logs found matching your criteria
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {log.userId && typeof log.userId === 'object' ? log.userId.name : 'Anonymous User'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {log.userId && typeof log.userId === 'object' ? log.userId.email : log.userId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadgeColor(log.action)}`}
                            >
                              {formatAction(log.action)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {log.resourceType && log.resourceType.charAt(0).toUpperCase() + log.resourceType.slice(1)}
                            </div>
                            {log.resourceId && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">{log.resourceId}</div>
                            )}
                            {log.action === 'update' && (
                              <>
                                {getChangeSummary(log) && (
                                  <div className="text-xs text-yellow-700 mt-1 font-medium">
                                    <span>Changed: {getChangeSummary(log).section}</span>
                                    <div className="text-xs text-yellow-600 italic">
                                      {getChangeSummary(log).fields.map((field, i) => (
                                        <span key={i}>
                                          {field}
                                          {i < getChangeSummary(log).fields.length - 1 ? ', ' : ''}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="text-sm text-gray-900">{formatTimestamp(log.timestamp)}</div>
                            <div className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ipAddress}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <button
                              onClick={() => openLogDetailsModal(log)}
                              className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Info className="h-4 w-4 mr-1" />
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Info */}
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredLogs.length}</span> of{" "}
                    <span className="font-medium">{pagination.total}</span> results
                  </div>
                  
                  {pagination.pages > 1 && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                        disabled={pagination.page === 1}
                        className={`px-3 py-1 rounded ${
                          pagination.page === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.pages}
                      </span>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                        disabled={pagination.page === pagination.pages}
                        className={`px-3 py-1 rounded ${
                          pagination.page === pagination.pages 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* User Log Details Modal */}
      <UserLogDetailsModal
        isOpen={isModalOpen}
        onClose={closeLogDetailsModal}
        log={selectedLog}
      />
    </div>
  )
} 