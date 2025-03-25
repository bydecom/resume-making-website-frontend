import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiUpload, FiCopy, FiLink, FiFile, FiChevronLeft } from 'react-icons/fi';
import DocumentProcessor from '../services/DocumentProcessor';

const CreateCVModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMethod, setUploadMethod] = useState(''); // 'file', 'link', hoặc ''
  const [pdfLink, setPdfLink] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const linkInputRef = useRef(null); // Thêm ref cho input link
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false); // Trạng thái khi đang kéo file

  // Reset tất cả state khi modal đóng 
  const handleClose = () => {
    // Reset tất cả state
    setShowUploadModal(false);
    setUploadMethod('');
    setPdfLink('');
    setFile(null);
    setIsProcessing(false);
    
    // Gọi hàm onClose từ props
    onClose();
  };

  // Auto-focus khi chọn phương thức
  useEffect(() => {
    // Focus vào input link khi chọn phương thức 'link'
    if (uploadMethod === 'link' && linkInputRef.current) {
      setTimeout(() => {
        linkInputRef.current.focus();
      }, 100);
    }
  }, [uploadMethod]);

  if (!isOpen) return null;

  const handleManualCreate = () => {
    // Chuyển hướng tới trang NewCV 
    window.hideHeader = true;
    navigate('/new-cv');
    handleClose();
  };

  const handleUploadFile = () => {
    // Mở modal upload thay vì chuyển hướng
    setShowUploadModal(true);
  };

  const handleUseTemplate = () => {
    // Chuyển đến trang chọn template
    navigate('/templates');
    handleClose();
  };

  const handleBackFromUpload = () => {
    // Quay lại màn hình chọn cách tạo CV
    setShowUploadModal(false);
    setUploadMethod('');
    setFile(null);
    setPdfLink('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Kiểm tra file có phải là PDF hoặc DOCX không
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
        console.log("File đã được chọn:", selectedFile.name);
      } else {
        alert('Please select a PDF or Word document (.docx)');
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBrowseClick = (e) => {
    if (e) e.preventDefault(); // Ngăn form submit nếu có
    
    // Kích hoạt click vào input file ẩn
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý sự kiện kéo file
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // Xử lý khi thả file
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.type === 'application/pdf' || 
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(droppedFile);
        console.log("File đã được kéo thả:", droppedFile.name);
      } else {
        alert('Please select a PDF or Word document (.docx)');
      }
    }
  };

  const handleSubmitUpload = async () => {
    try {
      // Hiển thị trạng thái đang xử lý
      setIsProcessing(true);
      
      let extractedText = '';
      
      if (uploadMethod === 'file' && file) {
        // Xử lý tải lên file
        console.log('Processing file:', file);
        extractedText = await DocumentProcessor.extractTextFromFile(file, 'eng');
        console.log('Extracted text (sample):', extractedText.substring(0, 200) + '...');
        
      } else if (uploadMethod === 'link' && pdfLink) {
        // Xử lý link PDF
        console.log('Processing PDF link:', pdfLink);
        extractedText = await DocumentProcessor.extractTextFromURL(pdfLink, 'eng');
        console.log('Extracted text from URL (sample):', extractedText.substring(0, 200) + '...');
        
      } else {
        alert('Please select a file or enter a valid PDF link');
        setIsProcessing(false);
        return;
      }
      
      if (!extractedText || extractedText.trim() === '') {
        throw new Error('Could not extract text from the document. Please try a different file.');
      }
      
      // Gửi extractedText đến API để phân tích
      // Hoặc hiển thị cho người dùng kiểm tra trước
      
      // Giả lập dữ liệu phân tích CV
      const extractedData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '(123) 456-7890',
          location: 'New York, NY',
          country: 'USA',
          website: 'www.johndoe.com',
          linkedin: 'linkedin.com/in/johndoe'
        },
        summary: 'Experienced software developer with a passion for creating elegant, efficient solutions.',
        experience: [
          {
            title: 'Senior Developer',
            company: 'Tech Company',
            startDate: '2020-01',
            endDate: '',
            description: 'Led development team on various projects.',
            isPresent: true
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of Technology',
            startDate: '2014-09',
            endDate: '2018-05',
            description: 'Graduated with honors',
            isPresent: false
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python']
      };
      
      console.log('Extracted data:', extractedData);
      
      // Chuyển hướng đến trang NewCV với data đã phân tích
      navigate('/new-cv', { 
        state: { 
          fromUpload: true, 
          extractedData: extractedData 
        } 
      });
      
      handleClose();
    } catch (error) {
      console.error('Error during document processing:', error);
      alert(`Error processing document: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const mainModal = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create New CV</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-center">
            Choose how you want to create your new CV
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Option 1: Create from Scratch */}
            <div 
              className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
              onClick={handleManualCreate}
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FiEdit className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create from Scratch</h3>
              <p className="text-gray-600 text-sm">
                Build your CV step by step with our guided wizard. No templates needed.
              </p>
            </div>
            
            {/* Option 2: Upload File */}
            <div 
              className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
              onClick={handleUploadFile}
            >
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FiUpload className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload Your CV</h3>
              <p className="text-gray-600 text-sm">
                Upload an existing CV document and we'll format it for you.
              </p>
            </div>
            
            {/* Option 3: Use Template */}
            <div 
              className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
              onClick={handleUseTemplate}
            >
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <FiCopy className="text-purple-600 text-3xl" />
              </div>
              <h3 className="text-lg font-medium mb-2">Use a Template</h3>
              <p className="text-gray-600 text-sm">
                Choose from our professionally designed templates to get started quickly.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button 
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const uploadModal = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={handleBackFromUpload}
              className="mr-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">Upload Your CV</h2>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-lg font-medium mb-2">Choose how to upload your CV</h3>
            <p className="text-gray-600">
              We support PDF and Word documents (.docx)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Upload File Option / Input */}
            {uploadMethod === 'file' ? (
              <div className="border border-blue-500 bg-blue-50 rounded-lg p-6 flex flex-col items-center text-center h-64">
                <div 
                  className={`border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-100' : 'border-blue-300'} rounded-lg p-4 flex flex-col items-center justify-center w-full h-full bg-white`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex flex-col items-center">
                      <FiFile className="text-blue-500 text-5xl mb-3" />
                      <p className="font-medium text-blue-800">{file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="mt-4 text-red-500 text-sm hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="text-blue-400 text-4xl mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drag and drop your file here, or</p>
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                        onClick={handleBrowseClick}
                      >
                        Browse Files
                      </button>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <p className="text-xs text-gray-500 mt-4">
                        Supported formats: PDF, DOCX
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div 
                className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all hover:border-blue-300 h-64"
                onClick={() => setUploadMethod('file')}
              >
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <FiFile className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-lg font-medium mb-2">Upload File</h3>
                <p className="text-gray-600 text-sm">
                  Upload a PDF or Word document from your computer
                </p>
              </div>
            )}
            
            {/* Link Option / Input */}
            {uploadMethod === 'link' ? (
              <div className="border border-purple-500 bg-purple-50 rounded-lg p-6 flex flex-col h-64">
                <h3 className="text-lg font-medium mb-2 text-center">Enter PDF Link</h3>
                <input
                  type="url"
                  value={pdfLink}
                  onChange={(e) => setPdfLink(e.target.value)}
                  placeholder="https://example.com/your-cv.pdf"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  ref={linkInputRef} // Gắn ref vào input link
                />
                <p className="text-xs text-gray-500 mt-2">
                  Make sure the link points directly to a PDF document
                </p>
                <div className="mt-auto bg-white border border-gray-200 rounded p-3">
                  <h4 className="font-medium text-sm text-purple-800 mb-1">Tips:</h4>
                  <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                    <li>Use Google Drive or Dropbox public links</li>
                    <li>Ensure the PDF is accessible without login</li>
                    <li>Check that your link ends with .pdf</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div 
                className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all hover:border-purple-300 h-64"
                onClick={() => setUploadMethod('link')}
              >
                <div className="bg-purple-100 p-4 rounded-full mb-4">
                  <FiLink className="text-purple-600 text-3xl" />
                </div>
                <h3 className="text-lg font-medium mb-2">Enter PDF Link</h3>
                <p className="text-gray-600 text-sm">
                  Provide a link to your PDF document
                </p>
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">How it works</h4>
            <ol className="text-sm text-gray-700 list-decimal pl-5 space-y-1">
              <li>Upload your existing CV in PDF or Word format</li>
              <li>Our system will extract information from your document</li>
              <li>Review and edit the extracted information</li>
              <li>Choose from our templates and customize your new CV</li>
            </ol>
          </div>
        </div>
        
        <div className="border-t p-4 bg-gray-50 flex justify-between">
          <button 
            onClick={handleBackFromUpload}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Back
          </button>
          <button 
            onClick={handleSubmitUpload}
            className={`px-4 py-2 rounded-md text-white ${
              isProcessing 
                ? 'bg-blue-400 cursor-not-allowed' 
                : (uploadMethod === 'file' && file) || (uploadMethod === 'link' && pdfLink)
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-400 cursor-not-allowed'
            }`}
            disabled={isProcessing || (!(uploadMethod === 'file' && file) && !(uploadMethod === 'link' && pdfLink))}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : 'Process Document'}
          </button>
        </div>
      </div>
    </div>
  );

  return showUploadModal ? uploadModal : mainModal;
};

export default CreateCVModal; 