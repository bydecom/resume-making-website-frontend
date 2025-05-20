import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Search, Filter, ChevronDown, ChevronUp, Loader, Info } from "lucide-react"
import api from "../../utils/api"
import LogDetailsModal from "../../components/LogDetailsModal"

export default function LogsPage() {
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
        const response = await api.get("/api/admin/logs", {
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
        console.error("Error fetching admin logs:", err)
        setError("Failed to fetch admin logs. Please try again later.")
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
    const detailsEmail = log.details && log.details.email ? log.details.email : ""
    const adminEmail = log.adminId && typeof log.adminId === 'object' ? log.adminId.email : ""
    const adminName = log.adminId && typeof log.adminId === 'object' ? log.adminId.name : ""

    const matchesSearch =
      detailsEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())

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
      case "delete_user":
        return "bg-red-100 text-red-800"
      case "update_user":
        return "bg-blue-100 text-blue-800"
      case "create_user":
        return "bg-green-100 text-green-800"
      case "login":
        return "bg-purple-100 text-purple-800"
      case "create_template":
      case "update_template":
      case "delete_template":
        return "bg-yellow-100 text-yellow-800"
      case "system_config":
        return "bg-orange-100 text-orange-800"
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Activity Logs</h1>
          <p className="mt-2 text-sm text-gray-500">View all admin actions performed in the system</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email or action..."
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
                        Admin
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
                        Target
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
                                  {log.adminId && typeof log.adminId === 'object' ? log.adminId.name : 'Unknown Admin'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {log.adminId && typeof log.adminId === 'object' ? log.adminId.email : log.adminId}
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
                            {log.details && log.details.email && (
                              <div className="text-sm text-gray-900">{log.details.email}</div>
                            )}
                            {log.details && log.details.userEmail && (
                              <div className="text-sm text-gray-900">{log.details.userEmail}</div>
                            )}
                            {log.details && log.details.userId && (
                              <div className="text-xs text-gray-500">{log.details.userId}</div>
                            )}
                            {log.details && log.details.updatedFields && (
                              <div className="text-xs text-gray-500 mt-1">
                                Updated: {log.details.updatedFields.join(", ")}
                              </div>
                            )}
                            {log.action === "update_user" && log.details && log.details.changes && (
                              <div className="text-xs text-gray-600 mt-1">
                                <span className="font-medium">Changed: </span>
                                {log.details.changes.map((change, index) => (
                                  <span key={index} className="italic">
                                    {change.field}
                                    {index < log.details.changes.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
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
      
      {/* Log Details Modal */}
      <LogDetailsModal
        isOpen={isModalOpen}
        onClose={closeLogDetailsModal}
        log={selectedLog}
      />
    </div>
  )
} 