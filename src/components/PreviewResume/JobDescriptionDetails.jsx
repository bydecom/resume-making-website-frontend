import React from 'react';

const JobDescriptionDetails = ({ jobData }) => {
  if (!jobData) return null;

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-3">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Position */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Position</label>
            <div className="p-2 rounded-lg">
              <p className="font-medium">{jobData.title || 'N/A'}</p>
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Company</label>
            <div className="p-2 rounded-lg">
              <p className="font-medium">{jobData.company || 'N/A'}</p>
            </div>
          </div>

          {/* Job Level */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Job Level</label>
            <div className="p-2 rounded-lg">
              <p className="font-medium capitalize">{jobData.jobLevel || 'N/A'}</p>
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Employment Type</label>
            <div className="p-2 rounded-lg">
              <p className="font-medium capitalize">{jobData.employmentType || 'N/A'}</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Locations</label>
            <div className="flex flex-wrap gap-2 p-2">
              {jobData.location ? (
                Array.isArray(jobData.location) ? (
                  jobData.location.map((loc, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {loc}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {jobData.location}
                  </span>
                )
              ) : (
                <p className="text-gray-500">No locations specified</p>
              )}
            </div>
          </div>

          {/* Experience Required */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Experience Required</label>
            <div className="p-2 rounded-lg">
              {jobData.experienceRequired ? (
                <div>
                  <p className="font-medium">
                    {jobData.experienceRequired.min === 0 && jobData.experienceRequired.max === 0
                      ? 'No experience required'
                      : `${jobData.experienceRequired.min}-${jobData.experienceRequired.max} years`}
                  </p>
                  {jobData.experienceRequired.description && (
                    <p className="text-sm text-gray-600 mt-1">{jobData.experienceRequired.description}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Not specified</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-3">Job Description</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {jobData.description || 'No description provided'}
        </p>
      </div>

      {/* Requirements */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-3">Requirements</h3>
        <ul className="list-disc list-inside space-y-1">
          {jobData.requirements?.length > 0 ? (
            jobData.requirements.map((req, index) => (
              <li key={index} className="text-gray-700">{req}</li>
            ))
          ) : (
            <li className="text-gray-500">No requirements specified</li>
          )}
        </ul>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-3">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {jobData.preferredSkills?.length > 0 ? (
            jobData.preferredSkills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No skills specified</p>
          )}
        </div>
      </div>

      {/* Benefits */}
      {jobData.benefits && jobData.benefits.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-medium mb-3">Benefits</h3>
          <ul className="list-disc list-inside space-y-1">
            {jobData.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-700">{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Salary */}
      {jobData.salary && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-medium mb-3">Salary</h3>
          <div>
            {jobData.salary.min === 0 && jobData.salary.max === 0 ? (
              <p className="text-gray-700">Negotiable</p>
            ) : (
              <p className="text-gray-700">
                {jobData.salary.min?.toLocaleString()} 
                {jobData.salary.max > 0 && ` - ${jobData.salary.max?.toLocaleString()}`} 
                {jobData.salary.currency} per {jobData.salary.period || 'Month'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionDetails; 