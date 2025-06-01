import { useState, useEffect } from "react"
import {
  Calendar as CalendarIcon,
  Briefcase as BriefcaseIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  Check as CheckIcon,
  X as XIcon,
  CalendarDays as CalendarDaysIcon,
  Building as BuildingIcon,
  AlertCircle as AlertCircleIcon,
  Loader2 as LoaderIcon,
  MoreVertical as MoreVerticalIcon,
  Trash2 as Trash2Icon,
  Eye as EyeIcon
} from "lucide-react"

import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import api, { callApi } from "../../../utils/api"


// Mock data for fallback if needed

export default function JDSection({ jobDescriptions = [], isLoading = false, error = null, refreshJobDescriptions }) {
  // Use the job descriptions from props if available
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null); // New state for dropdown menu

  // Update jobs state when jobDescriptions prop changes
  useEffect(() => {
    if (jobDescriptions && jobDescriptions.length > 0) {
      setJobs(jobDescriptions);
    } else if (!isLoading && !error) {
      setJobs([]);
    }
  }, [jobDescriptions, isLoading, error]);

  // Filter jobs based on status
  const filteredJobs = jobs.filter((job) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "not-applied") return job.applicationStatus === "Not Applied";
    if (statusFilter === "applied") return job.applicationStatus === "Applied";
    if (statusFilter === "rejected") return job.applicationStatus === "Rejected";
    if (statusFilter === "approved") return job.applicationStatus === "Interview";
    return true;
  });

  const handleStatusChange = async (jobId, status) => {
    // 1. Xác định trạng thái mới sẽ được cập nhật
    let targetApplicationStatus;
    switch (status) {
      case "apply":
        targetApplicationStatus = "Applied";
        break;
      case "approve":
        targetApplicationStatus = "Interview";
        break;
      case "reject":
        targetApplicationStatus = "Rejected";
        break;
      case "not-applied":
      default: // Bao gồm cả default và "not-applied"
        targetApplicationStatus = "Not Applied";
        break;
    }

    // 2. Tìm job hiện tại để có thể rollback nếu lỗi
    const currentJob = jobs.find(j => j._id === jobId);
    const originalStatus = currentJob?.applicationStatus;

    // 3. Đặt trạng thái đang cập nhật (cho select/button)
    setIsUpdating(true);

    try {
      // 4. Gọi API
      await callApi(`/api/job-descriptions/${jobId}`, 'PUT', {
        applicationStatus: targetApplicationStatus // Gửi trạng thái mới lên server
      });

      // 5. Cập nhật state `jobs` cục bộ sau khi API thành công
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === jobId
            ? { ...job, applicationStatus: targetApplicationStatus } // Cập nhật job tương ứng
            : job // Giữ nguyên các job khác
        )
      );

      // 6. Cập nhật selectedJob nếu modal đang mở
      if (selectedJob && selectedJob._id === jobId) {
        setSelectedJob(prev => ({
          ...prev,
          applicationStatus: targetApplicationStatus
        }));

        // Xử lý việc hiển thị form phỏng vấn
        if (targetApplicationStatus === "Interview") {
          // Có thể bạn muốn mở form ngay cả khi chưa có chi tiết phỏng vấn
          setShowInterviewForm(true);
          // Nếu muốn reset khi chuyển sang Interview nhưng chưa có data:
          if (!currentJob?.interviewDate) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const formattedTomorrow = tomorrow.toISOString().split('T')[0];
            setInterviewDate(formattedTomorrow);
            setInterviewTime("10:00"); // Giá trị mặc định
            setInterviewLocation("");   // Giá trị mặc định
          }
        } else {
          setShowInterviewForm(false);
        }
      }
    } catch (error) {
      console.error("Error updating job application status:", error);
      alert("Failed to update application status. Please try again.");
    } finally {
      // 7. Hoàn tất cập nhật
      setIsUpdating(false);
    }
  };

  const saveInterviewDetails = async (jobId) => {
    if (!interviewDate || !interviewTime || !interviewLocation) return;

    // 1. Chuẩn bị dữ liệu mới
    const formattedDate = new Date(interviewDate).toISOString();
    const updatedInterviewData = {
      applicationStatus: "Interview", // Đảm bảo status là Interview
      interviewDate: formattedDate,
      interviewTime,
      interviewLocation
    };

    setIsUpdating(true);

    try {
      // 2. Gọi API
      await callApi(`/api/job-descriptions/${jobId}`, 'PUT', updatedInterviewData);

      // 3. Cập nhật state `jobs` cục bộ sau khi API thành công
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === jobId
            ? { ...job, ...updatedInterviewData } // Cập nhật job tương ứng với dữ liệu mới
            : job
        )
      );

      // 4. Cập nhật selectedJob nếu modal đang mở
      if (selectedJob && selectedJob._id === jobId) {
        setSelectedJob(prev => ({
          ...prev,
          ...updatedInterviewData
        }));
      }

      // 5. Reset form và đóng modal (chỉ khi thành công)
      setInterviewDate("");
      setInterviewTime("");
      setInterviewLocation("");
      setIsModalOpen(false);
      setShowInterviewForm(false);
    } catch (error) {
      console.error("Error saving interview details:", error);
      alert("Failed to save interview details. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (job) => {
    switch (job.applicationStatus) {
      case "Rejected":
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-md">Rejected</span>;
      case "Interview":
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md">Interview</span>;
      case "Applied":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">Applied</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-md">Not Applied</span>;
    }
  };

  // Function to get card styling based on status
  const getCardStyling = (status) => {
    switch (status) {
      case "Rejected":
        return "border-red-200 bg-red-50";
      case "Interview":
        return "border-green-200 bg-green-50";
      case "Applied":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  // Function to get card action area styling
  const getActionAreaStyling = (status) => {
    switch (status) {
      case "Rejected":
        return "border-t border-red-200";
      case "Interview":
        return "border-t border-green-200";
      case "Applied":
        return "border-t border-blue-200";
      default:
        return "border-t border-gray-100";
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch (error) {
      return dateString;
    }
  };
  
  const openJobDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    setShowInterviewForm(false);
    
    // Set interview details if available
    if (job.interviewDate) {
      // Format the date for the date input (YYYY-MM-DD)
      const date = new Date(job.interviewDate);
      const formattedDate = date.toISOString().split('T')[0];
      setInterviewDate(formattedDate);
      setInterviewTime(job.interviewTime || "");
      setInterviewLocation(job.interviewLocation || "");
    } else {
      // Reset form
      setInterviewDate("");
      setInterviewTime("");
      setInterviewLocation("");
    }
  };
  
  const openInterviewDetails = (job, event) => {
    event.stopPropagation();
    setSelectedJob(job);
    setIsModalOpen(true);
    setShowInterviewForm(true);
    
    // Set interview details if available
    if (job.interviewDate) {
      // Format the date for the date input (YYYY-MM-DD)
      const date = new Date(job.interviewDate);
      const formattedDate = date.toISOString().split('T')[0];
      setInterviewDate(formattedDate);
      setInterviewTime(job.interviewTime || "");
      setInterviewLocation(job.interviewLocation || "");
    } else {
      // Reset form
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedTomorrow = tomorrow.toISOString().split('T')[0];
      
      setInterviewDate(formattedTomorrow);
      setInterviewTime("10:00");
      setInterviewLocation("");
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setShowInterviewForm(false);
    // Reset form
    setInterviewDate("");
    setInterviewTime("");
    setInterviewLocation("");
  };

  // Toggle dropdown menu
  const toggleMenu = (jobId) => {
    setActiveMenuId(activeMenuId === jobId ? null : jobId);
  };

  // Handle soft delete
  const handleSoftDelete = async (jobId) => {
    try {
      setIsUpdating(true);
      await callApi(`/api/job-descriptions/${jobId}`, 'DELETE');
      
      // Update local state to remove the deleted job
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      setActiveMenuId(null); // Close the menu
      
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your Job Applications</h2>
          <p className="text-gray-500 mt-2"> Monitor your progress for each saved job, from application to interview.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex justify-center items-center py-12">
            <LoaderIcon className="h-8 w-8 text-blue-600 animate-spin mr-2" />
            <p className="text-gray-600">Loading job descriptions...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your Job Applications</h2>
          <p className="text-gray-500 mt-2"> Monitor your progress for each saved job, from application to interview.</p>
        </div>
        
        <div className="bg-white rounded-lg border border-red-200 shadow-sm mb-6 p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircleIcon className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-medium">Error Loading Job Applications</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshJobDescriptions}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Your Job Applications</h2>
        <p className="text-gray-500 mt-2"> Monitor your progress for each saved job, from application to interview.</p>
      </div>

      {/* Status filter tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          <button
            className={`px-6 py-4 text-center ${
              statusFilter === "all" 
                ? "text-blue-600 border-b-2 border-blue-600 font-medium" 
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
          <button
            className={`px-6 py-4 text-center ${
              statusFilter === "not-applied" 
                ? "text-blue-600 border-b-2 border-blue-600 font-medium" 
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setStatusFilter("not-applied")}
          >
            Not Applied
          </button>
          <button
            className={`px-6 py-4 text-center ${
              statusFilter === "applied" 
                ? "text-blue-600 border-b-2 border-blue-600 font-medium" 
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setStatusFilter("applied")}
          >
            Applied
          </button>
          <button
            className={`px-6 py-4 text-center ${
              statusFilter === "rejected" 
                ? "text-blue-600 border-b-2 border-blue-600 font-medium" 
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setStatusFilter("rejected")}
          >
            Rejected
          </button>
          <button
            className={`px-6 py-4 text-center ${
              statusFilter === "approved" 
                ? "text-blue-600 border-b-2 border-blue-600 font-medium" 
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setStatusFilter("approved")}
          >
            Interviews
          </button>
        </div>
      </div>

{/* Job cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          // --- CARD CONTAINER ---
          <div 
            key={job._id} 
            className={`rounded-lg border shadow-sm overflow-hidden flex flex-col min-h-[300px] ${getCardStyling(job.applicationStatus)}`}
          >

            {/* --- CONTENT AREA --- */}
            <div className="flex-grow">
              {/* Phần Title, Badge, Company */}
              <div className="p-5 cursor-pointer" onClick={() => openJobDetails(job)}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 mr-2">{job.position}</h3>
                  </div>
                  <div className="flex items-start gap-2">
                    <div>{getStatusBadge(job)}</div>
                    {/* Dropdown Menu Button */}
                    <div className="relative">
                      <button 
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(job._id);
                        }}
                      >
                        <MoreVerticalIcon className="h-5 w-5 text-gray-500" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === job._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                openJobDetails(job);
                              }}
                            >
                              <EyeIcon className="h-4 w-4" />
                              View Details
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this job?')) {
                                  handleSoftDelete(job._id);
                                }
                              }}
                            >
                              <Trash2Icon className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <BuildingIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{job.companyName}</span>
              </div>
              </div>

              {/* Phần Location, Deadline, Interview */}
              <div className="px-5 pb-3 cursor-pointer" onClick={() => openJobDetails(job)}>
                <div className="flex items-start text-sm text-gray-500 mb-2">
                  <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {job.location?.join(", ") || "No location specified"} {job.location?.length > 0 ? '• ' : ''}{job.remoteStatus}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className={new Date(job.applicationDeadline) < new Date() ? "text-red-500 font-medium" : "font-medium"}>
                  Deadline: {formatDate(job.applicationDeadline)}
                </span>
              </div>

                {/* Phần Interview (Conditional) */}
                {job.applicationStatus === "Interview" && job.interviewDate && (
                  <div className="mt-3 p-2 bg-green-100 rounded-md">
                    <p className="text-sm font-medium flex items-center truncate">
                      <CalendarDaysIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      Interview: {formatDate(job.interviewDate)} at {job.interviewTime}
                  </p>
                    <p className="text-sm text-gray-700 truncate">
                      Location: {job.interviewLocation}
                    </p>
                </div>
              )}
              </div>
            </div> {/* --- END CONTENT AREA --- */}


            {/* --- ACTION AREA --- */}
            <div className={`px-5 py-3 ${getActionAreaStyling(job.applicationStatus)} grid grid-cols-3 gap-2 items-center`}>
              {/* Column 1: View Details Button */}
              <div className="flex items-center">
                <button
                  onClick={() => openJobDetails(job)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                >
                    Details
                </button>
              </div>
              
              {/* Column 2: Interview Button (if applicable) */}
              <div className="flex justify-center">
                {job.applicationStatus === "Interview" && (
                  <button
                    onClick={(e) => openInterviewDetails(job, e)}
                    className="w-10 h-10 flex items-center justify-center bg-green-100 border border-green-300 text-green-700 rounded-md hover:bg-green-200"
                    title={job.interviewDate ? "Edit Interview" : "Set Interview"}
                  >
                    <CalendarDaysIcon className="h-5 w-5" />
                  </button>
                )}
                        </div>

              {/* Column 3: Status Select */}
              <div className="flex justify-end">
                <select
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                  value={job.applicationStatus}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "Applied") {
                      handleStatusChange(job._id, "apply");
                    } else if (value === "Not Applied") {
                      handleStatusChange(job._id, "not-applied");
                    } else if (value === "Rejected") {
                      handleStatusChange(job._id, "reject");
                    } else if (value === "Interview") {
                      handleStatusChange(job._id, "approve");
                    }
                  }}
                  disabled={isUpdating}
                >
                  <option value="Not Applied">Not Applied</option>
                  <option value="Applied">Applied</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Interview">Interview</option>
                </select>
                            </div>
            </div> {/* --- END ACTION AREA --- */}

          </div> // --- END CARD CONTAINER ---
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No job descriptions found for the selected filter.</p>
                            </div>
                          )}

      {/* Job Details Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">{selectedJob.position}</h2>
              <p className="text-lg text-gray-600">
                {selectedJob.companyName} • {selectedJob.location?.join(", ") || "No location"} • {selectedJob.remoteStatus}
              </p>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-6 h-6" />
              </button>
                        </div>

            <div className="p-6">
              {/* Application Status Buttons - Moved to the top */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4">Application Status</h3>
                          <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleStatusChange(selectedJob._id, "not-applied")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      selectedJob.applicationStatus === "Not Applied" 
                        ? "bg-gray-600 text-white hover:bg-gray-700" 
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    disabled={isUpdating}
                            >
                    {selectedJob.applicationStatus === "Not Applied" && <CheckIcon className="h-4 w-4" />}
                    {selectedJob.applicationStatus === "Not Applied" ? "Not Applied" : "Mark as Not Applied"}
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedJob._id, selectedJob.applicationStatus === "Applied" ? "not-applied" : "apply")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      selectedJob.applicationStatus === "Applied" 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    disabled={isUpdating}
                  >
                    {selectedJob.applicationStatus === "Applied" && <CheckIcon className="h-4 w-4" />}
                    {selectedJob.applicationStatus === "Applied" ? "Applied" : "Mark as Applied"}
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedJob._id, selectedJob.applicationStatus === "Rejected" ? "not-applied" : "reject")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      selectedJob.applicationStatus === "Rejected"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    disabled={isUpdating}
                  >
                    {selectedJob.applicationStatus === "Rejected" && <XIcon className="h-4 w-4" />}
                    {selectedJob.applicationStatus === "Rejected" ? "Rejected" : "Mark as Rejected"}
                  </button>

                  <button
                    onClick={() => {
                      if (selectedJob.applicationStatus === "Interview") {
                        setShowInterviewForm(!showInterviewForm);
                      } else {
                        handleStatusChange(selectedJob._id, "approve");
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      selectedJob.applicationStatus === "Interview"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    disabled={isUpdating}
                            >
                    {selectedJob.applicationStatus === "Interview" ? (
                      <>
                        <CalendarDaysIcon className="h-4 w-4" />
                        {showInterviewForm ? "Hide Interview Form" : "Edit Interview Details"}
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Mark for Interview
                      </>
                    )}
                  </button>
                          </div>
                        </div>

              {/* If showing interview form, display it next */}
              {showInterviewForm && selectedJob.applicationStatus === "Interview" && (
                <div className="border-t border-b border-gray-200 py-6 mb-6">
                  <div className="flex items-center text-lg font-semibold mb-4">
                    <CalendarDaysIcon className="h-5 w-5 mr-2 text-green-600" />
                    <h3>Interview Details</h3>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="interview-date">Interview Date</Label>
                        <Input
                          id="interview-date"
                          type="date"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                        />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="interview-time">Interview Time</Label>
                                  <Input
                                    id="interview-time"
                                    type="time"
                                    value={interviewTime}
                                    onChange={(e) => setInterviewTime(e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="interview-location">Interview Location</Label>
                                <Input
                                  id="interview-location"
                                  placeholder="Office address or online meeting link"
                                  value={interviewLocation}
                                  onChange={(e) => setInterviewLocation(e.target.value)}
                                />
                              </div>

                    <div className="flex gap-3">
                      <button
                                onClick={() => saveInterviewDetails(selectedJob._id)}
                        disabled={!interviewDate || !interviewTime || !interviewLocation || isUpdating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? (
                          <>
                            <LoaderIcon className="h-4 w-4 mr-2 inline animate-spin" />
                            Saving...
                          </>
                        ) : "Save Interview Details"}
                      </button>
                      
                      <button
                        onClick={() => setShowInterviewForm(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                            </div>

                  {selectedJob.interviewDate && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                <h4 className="font-medium mb-2">Current Interview Schedule</h4>
                                <p className="text-sm">
                        <span className="font-medium">Date:</span> {formatDate(selectedJob.interviewDate)}
                                </p>
                                <p className="text-sm">
                        <span className="font-medium">Time:</span> {selectedJob.interviewTime || "Not specified"}
                                </p>
                                <p className="text-sm">
                        <span className="font-medium">Location:</span> {selectedJob.interviewLocation || "Not specified"}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {selectedJob.jobLevel} • {selectedJob.employmentType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span className={new Date(selectedJob.applicationDeadline) < new Date() ? "text-red-500" : ""}>
                    Deadline: {formatDate(selectedJob.applicationDeadline)}
                  </span>
                </div>
              </div>

              <div className="space-y-6 mt-4">
                {selectedJob.summary && selectedJob.summary.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Summary</h3>
                    <p className="text-gray-700">{selectedJob.summary.join(" ")}</p>
                  </div>
                )}

                {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {selectedJob.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {selectedJob.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedJob.skillsRequired && selectedJob.skillsRequired.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {selectedJob.skillsRequired.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                      </div>
                )}
                
                {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Benefits</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {selectedJob.benefits.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
      </div>
        </div>
      )}
    </section>
  )
}
