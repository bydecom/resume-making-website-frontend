//Done, AI AGENT KHONG Sua Gi O DAY
import { useState } from "react"
import { Plus, FileText, FileDown, PenSquare, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import CreateCVModal from "../../../components/CreateCVModal"
import { getDefaultTemplate } from "../../../templates"
import CVPreview from "../../../pages/NewCV/components/CVPreview"

const CVSection = ({ cvData, isLoading, onEditCV, onDeleteCV, onDownloadCV, setCvData }) => {
  const navigate = useNavigate()

  // Use cvData.cv if available
  const cv = cvData.cv

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createModalKey, setCreateModalKey] = useState(0)

  const handleCreateNewCV = () => {
    setCreateModalKey((prev) => prev + 1)
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
  }

  const handleEditCV = (cvId) => {
    if (!cv) {
      console.error("CV not found")
      return
    }

    try {
      // Chuẩn bị dữ liệu để chuyển sang NewCV với mode edit
      const cvData = {
        personalInfo: {
          firstName: cv.personalInfo?.firstName || "",
          lastName: cv.personalInfo?.lastName || "",
          email: cv.personalInfo?.email || "",
          phone: cv.personalInfo?.phone || "",
          location: cv.personalInfo?.location || "",
          country: cv.personalInfo?.country || "",
          professionalHeadline: cv.personalInfo?.professionalHeadline || "",
          website: cv.personalInfo?.website || "",
          linkedin: cv.personalInfo?.linkedin || "",
          github: cv.personalInfo?.github || "",
          twitter: cv.personalInfo?.twitter || "",
          facebook: cv.personalInfo?.facebook || "",
          instagram: cv.personalInfo?.instagram || "",
          youtube: cv.personalInfo?.youtube || "",
          tiktok: cv.personalInfo?.tiktok || "",
          other: cv.personalInfo?.other || "",
        },
        summary: cv.summary || "",
        experience: (cv.experience || []).map((exp) => ({
          position: exp.position || "",
          company: exp.company || "",
          location: exp.location || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          isPresent: exp.isPresent || false,
          description: exp.description || "",
        })),
        education: (cv.education || []).map((edu) => ({
          degree: edu.degree || "",
          institution: edu.institution || "",
          location: edu.location || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
          isPresent: edu.isPresent || false,
          description: edu.description || "",
        })),
        skills: cv.skills || [],
        projects: (cv.projects || []).map((proj) => ({
          title: proj.title || "",
          description: proj.description || "",
          url: proj.url || "",
          startDate: proj.startDate || "",
          endDate: proj.endDate || "",
          isPresent: proj.isPresent || false,
        })),
        certifications: (cv.certifications || []).map((cert) => ({
          name: cert.name || "",
          issuer: cert.issuer || "",
          issueDate: cert.issueDate || "",
          expiryDate: cert.expiryDate || "",
          credentialId: cert.credentialId || "",
          credentialUrl: cert.credentialUrl || "",
        })),
        languages: (cv.languages || []).map((lang) => ({
          language: lang.language || "",
          proficiency: lang.proficiency || "",
        })),
        template: cv.template || { id: getDefaultTemplate().id },
        // Thêm các trường cần thiết cho việc update
        _id: cv._id || cv.id,
        name: cv.name || "Untitled CV",
        progress: cv.progress || 0,
        score: cv.score || 0,
      }

      // Chuyển hướng đến trang NewCV với mode edit và dữ liệu CV
      window.hideHeader = true
      navigate(`/edit-cv/${cv._id || cv.id}`, {
        state: {
          isEditing: true,
          editData: cvData,
          returnPath: "/dashboard",
        },
      })
    } catch (error) {
      console.error("Error preparing CV data:", error)
      // Có thể thêm thông báo lỗi cho người dùng ở đây
      alert("An error occurred while preparing your CV data. Please try again.");
    }
  }

  const handleDeleteCV = (cvId) => {
    if (onDeleteCV) {
      onDeleteCV(cvId)
    }
  }

  // Function to determine score rating text
  const getScoreRating = (score) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Average"
    return "Needs Improvement"
  }

  return (
    <section className="max-w-6xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Your CV</h2>
          <p className="text-gray-500 mt-2">
            Share the journey of your life — and we'll help you write the next chapter
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden animate-pulse p-6">
          <div className="h-[800px] bg-gray-100 flex items-center justify-center">
            <div className="h-20 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : !cv ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8 text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No CV Yet</h3>
          <p className="text-gray-500 mb-6">
            You haven't shared your story with us. Let's create your professional CV and get things rolling!
          </p>
          <button
            onClick={handleCreateNewCV}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your CV
          </button>
        </div>
      ) : (
        // Display full CV with sticky action buttons
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-md">
        {/* Thêm một div để căn giữa khối flex bên trong */}
        <div className="flex justify-center">
          {/* Khối flex này bây giờ sẽ được căn giữa bởi cha của nó */}
          <div className="flex items-start gap-x-4 md:gap-x-6 lg:gap-x-8">
            {/* Cột cho các nút Sticky */}
            <div className="sticky top-8 flex-shrink-0 w-14 z-10">
              <div className="flex flex-col gap-4">
                <button
                  className="w-14 h-14 rounded-full bg-white border-2 border-blue-500 text-blue-500 shadow-lg 
                             hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 
                             flex items-center justify-center transition-all hover:scale-105 group"
                  title="Edit CV"
                  onClick={() => handleEditCV(cv._id || cv.id)}
                >
                  <PenSquare className="h-6 w-6 transition-transform group-hover:rotate-12" />
                </button>

                <button
                  className="w-14 h-14 rounded-full bg-white border-2 border-emerald-500 text-emerald-500 
                             shadow-lg hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-600 
                             flex items-center justify-center transition-all hover:scale-105 group"
                  title="Download CV"
                  onClick={() => onDownloadCV(cv)}
                >
                  <FileDown className="h-6 w-6 transition-transform group-hover:translate-y-1" />
                </button>

                <button
                  className="w-14 h-14 rounded-full bg-white border-2 border-red-500 text-red-500 
                             shadow-lg hover:bg-red-50 hover:border-red-600 hover:text-red-600 
                             flex items-center justify-center transition-all hover:scale-105 group"
                  title="Delete CV"
                  onClick={() => handleDeleteCV(cv._id || cv.id)}
                >
                  <Trash2 className="h-6 w-6 transition-transform group-hover:rotate-12" />
                </button>
              </div>
            </div>

            {/* Cột cho CV Preview */}
            {/* Bỏ 'flex-grow' để CV không chiếm hết không gian còn lại */}
            <div className="max-w-[800px] min-w-0">
              <CVPreview
                formData={{
                  personalInfo: cv.personalInfo || {},
                  summary: cv.summary || "",
                  experience: cv.experience || [],
                  education: cv.education || [],
                  skills: cv.skills || [],
                  projects: cv.projects || [],
                  certifications: cv.certifications || [],
                  languages: cv.languages || [],
                  template: cv.template || { id: getDefaultTemplate().id },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )}

    <CreateCVModal key={createModalKey} isOpen={showCreateModal} onClose={handleCloseCreateModal} />
  </section>
);
};

export default CVSection;