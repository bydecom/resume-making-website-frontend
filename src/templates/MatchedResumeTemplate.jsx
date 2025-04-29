import { FiMail, FiPhone, FiMapPin, FiGlobe, FiLinkedin } from "react-icons/fi"

const SkillButton = ({ skill, relevance, comment }) => {
  const getRelevanceColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800 hover:bg-green-200"
    if (score >= 60) return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }

  return (
    <div className="relative group">
      <button
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 ${getRelevanceColor(relevance)}`}
      >
        <span className="font-medium">{skill}</span>
        <span className="text-xs font-semibold px-1.5 py-0.5 bg-white bg-opacity-50 rounded-full">{relevance}%</span>
      </button>

      {/* Tooltip */}
      {comment && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="relative">
            <div className="font-medium mb-1">AI Insight:</div>
            <p className="text-gray-200 text-xs leading-relaxed">{comment}</p>
            {/* Arrow */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

const MatchedResumeTemplate = ({ formData }) => {
  // Use the provided resumeData directly instead of formData
  const {
    personalInfo,
    roleApply,
    summary,
    matchedEducation,
    matchedExperience,
    matchedSkills,
    matchedProjects,
    matchedCertifications,
    matchedLanguages,
    additionalInfo,
    customFields,
  } = formData || {}

  // Hàm format ngày tháng an toàn
  const formatDate = (dateString, isPresent = false) => {
    if (isPresent) return "Present"
    if (!dateString) return ""

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    } catch (error) {
      console.error("Date formatting error:", error)
      return dateString
    }
  }

  // Hàm tính màu dựa trên relevance score
  const getRelevanceColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  // Hàm render relevance badge
  const RelevanceBadge = ({ score }) => (
    <span className={`text-xs px-2 py-1 rounded-full ${getRelevanceColor(score)}`}>{score}% Match</span>
  )

  return (
    <div
      className="resume-preview bg-white rounded-lg overflow-hidden shadow-lg"
      style={{
        fontFamily: '"Inter", sans-serif',
        color: "#333333",
        fontSize: "0.9rem",
      }}
    >
      {/* Header Section */}
      <div className="p-6 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold mb-1">
          {personalInfo?.firstName || "John"} {personalInfo?.lastName || "Doe"}
        </h1>

        <p className="text-lg my-2">
          {roleApply || personalInfo?.professionalHeadline || "Professional Title"}
        </p>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 text-sm mt-3 text-blue-50">
          {personalInfo?.email && (
            <div className="flex items-center">
              <FiMail className="mr-1" />
              <span>{personalInfo.email}</span>
            </div>
          )}

          {personalInfo?.phone && (
            <div className="flex items-center">
              <FiPhone className="mr-1" />
              <span>{personalInfo.phone}</span>
            </div>
          )}

          {(personalInfo?.location || personalInfo?.country) && (
            <div className="flex items-center">
              <FiMapPin className="mr-1" />
              <span>
                {personalInfo.location}
                {personalInfo.location && personalInfo.country && ", "}
                {personalInfo.country}
              </span>
            </div>
          )}

          {personalInfo?.website && (
            <div className="flex items-center">
              <FiGlobe className="mr-1" />
              <span>{personalInfo.website}</span>
            </div>
          )}

          {personalInfo?.linkedin && (
            <div className="flex items-center">
              <FiLinkedin className="mr-1" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Summary Section */}
        {summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience Section */}
        {matchedExperience && matchedExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Experience</h2>
            <div className="space-y-4">
              {matchedExperience.map((exp, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <div className="absolute top-4 right-4">
                    <RelevanceBadge score={exp.relevance} />
                  </div>
                  <div className="pr-24">
                    <h3 className="font-medium text-gray-900">{exp.title}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(exp.startDate)} - {exp.isPresent ? "Present" : formatDate(exp.endDate)}
                    </div>
                    {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
                    {exp.comment && (
                      <div className="mt-2 text-sm bg-blue-50 text-blue-700 p-2 rounded">
                        <strong>AI Insight:</strong> {exp.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section with updated rendering */}
        {matchedSkills && matchedSkills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, index) => (
                <SkillButton key={index} skill={skill.skill} relevance={skill.relevance} comment={skill.comment} />
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {matchedEducation && matchedEducation.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Education</h2>
            <div className="space-y-4">
              {matchedEducation.map((edu, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <div className="absolute top-4 right-4">
                    <RelevanceBadge score={edu.relevance} />
                  </div>
                  <div className="pr-24">
                    <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(edu.startDate)} - {edu.isPresent ? "Present" : formatDate(edu.endDate)}
                    </div>
                    {edu.description && <p className="mt-2 text-gray-700">{edu.description}</p>}
                    {edu.comment && (
                      <div className="mt-2 text-sm bg-blue-50 text-blue-700 p-2 rounded">
                        <strong>AI Insight:</strong> {edu.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {matchedProjects && matchedProjects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Projects</h2>
            <div className="space-y-4">
              {matchedProjects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <div className="absolute top-4 right-4">
                    <RelevanceBadge score={project.relevance} />
                  </div>
                  <div className="pr-24">
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    {project.role && <p className="text-gray-600">{project.role}</p>}
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(project.startDate)} - {project.isPresent ? "Present" : formatDate(project.endDate)}
                    </div>
                    {project.description && <p className="mt-2 text-gray-700">{project.description}</p>}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                      >
                        View Project →
                      </a>
                    )}
                    {project.comment && (
                      <div className="mt-2 text-sm bg-blue-50 text-blue-700 p-2 rounded">
                        <strong>AI Insight:</strong> {project.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {matchedCertifications && matchedCertifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Certifications</h2>
            <div className="space-y-4">
              {matchedCertifications.map((cert, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <div className="absolute top-4 right-4">
                    <RelevanceBadge score={cert.relevance} />
                  </div>
                  <div className="pr-24">
                    <h3 className="font-medium text-gray-900">{cert.name}</h3>
                    <p className="text-gray-600">{cert.issuer}</p>
                    {cert.date && <div className="text-sm text-gray-500 mt-1">{formatDate(cert.date)}</div>}
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                      >
                        Verify Certificate →
                      </a>
                    )}
                    {cert.comment && (
                      <div className="mt-2 text-sm bg-blue-50 text-blue-700 p-2 rounded">
                        <strong>AI Insight:</strong> {cert.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {matchedLanguages && matchedLanguages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Languages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedLanguages.map((lang, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <div className="absolute top-4 right-4">
                    <RelevanceBadge score={lang.relevance} />
                  </div>
                  <div className="pr-24">
                    <h3 className="font-medium text-gray-900">{lang.language}</h3>
                    <p className="text-gray-600">{lang.proficiency}</p>
                    {lang.comment && (
                      <div className="mt-2 text-sm bg-blue-50 text-blue-700 p-2 rounded">
                        <strong>AI Insight:</strong> {lang.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {additionalInfo && Object.keys(additionalInfo).length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Additional Information</h2>
            <div className="space-y-4">
              {additionalInfo.interests && (
                <div>
                  <h3 className="font-medium text-gray-900">Interests</h3>
                  <p className="text-gray-700">{additionalInfo.interests}</p>
                </div>
              )}
              {additionalInfo.achievements && (
                <div>
                  <h3 className="font-medium text-gray-900">Achievements</h3>
                  <p className="text-gray-700">{additionalInfo.achievements}</p>
                </div>
              )}
              {additionalInfo.publications && (
                <div>
                  <h3 className="font-medium text-gray-900">Publications</h3>
                  <p className="text-gray-700">{additionalInfo.publications}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchedResumeTemplate
