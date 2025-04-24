import React, { useState } from 'react';
import { Upload, Link, Clipboard } from 'lucide-react';
import api from '../../../../utils/api';
import JobDescriptionScanningPreview from './JobDescriptionScanningPreview';

const JobDescriptionStep = ({ onSubmit }) => {
  const [method, setMethod] = useState('paste');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [showScanningPreview, setShowScanningPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleSubmit = async () => {
    setError('');

    try {
      let textToProcess = '';

      // Validate and get text based on method
      if (method === 'paste') {
        if (!jobDescription.trim()) {
          setError('Please enter the job description');
          return;
        }
        textToProcess = jobDescription;
      } else if (method === 'url') {
        if (!jobUrl.trim()) {
          setError('Please enter a valid job URL');
          return;
        }
        // Here you might want to fetch the content from URL first
        textToProcess = jobUrl;
      } else if (method === 'file') {
        if (!file) {
          setError('Please upload a file');
          return;
        }
        // Read file content
        const text = await readFileContent(file);
        textToProcess = text;
      }

      setIsProcessing(true);
      setShowScanningPreview(true);

      // Call API to extract job description data
      const response = await api.post('/api/extract/job-description', {
        text: textToProcess
      });

      if (response.data.status === 'success') {
        setExtractedData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to extract job description');
      }

    } catch (error) {
      console.error('Error processing job description:', error);
      setError(error.message || 'An error occurred while processing the job description');
      setIsProcessing(false);
      setShowScanningPreview(false);
    }
  };

  // Helper function to read file content
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  // Handle completion of scanning preview and final submission
  const handleScanningComplete = (data) => {
    setShowScanningPreview(false);
    setIsProcessing(false);
    onSubmit(data); // This will now be called after user confirms in the preview
  };

  return (
    <>
      <div className="space-y-6">
        {/* Method Selection */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setMethod('paste')}
            className={`px-4 py-2 -mb-px ${
              method === 'paste'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Clipboard className="h-4 w-4" />
              <span>Paste</span>
            </div>
          </button>
          <button
            onClick={() => setMethod('url')}
            className={`px-4 py-2 -mb-px ${
              method === 'url'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4" />
              <span>URL</span>
            </div>
          </button>
          <button
            onClick={() => setMethod('file')}
            className={`px-4 py-2 -mb-px ${
              method === 'file'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </div>
          </button>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          {method === 'paste' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-56 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Paste the job description here..."
              />
            </div>
          )}

          {method === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Posting URL
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/job-posting"
              />
            </div>
          )}

          {method === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Job Description
              </label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <span className="text-gray-600">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    PDF, DOC, DOCX, or TXT
                  </span>
                </label>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="text-sm text-gray-500">
            <p>
              Tip: The more detailed the job description, the better we can tailor your resume.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`w-full px-4 py-2 text-white rounded-lg font-medium ${
              isProcessing
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </div>
            ) : (
              'Process Job Description'
            )}
          </button>
        </div>
      </div>

      {/* Scanning Preview Modal */}
      <JobDescriptionScanningPreview
        isOpen={showScanningPreview}
        onComplete={handleScanningComplete}
        data={extractedData}
      />
    </>
  );
};

export default JobDescriptionStep; 