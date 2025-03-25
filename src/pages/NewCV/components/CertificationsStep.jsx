import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CertificationsStep = ({ data = [], updateData, hideTitle = false }) => {
  const [certifications, setCertifications] = useState(data || []);
  const [currentCertification, setCurrentCertification] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expirationDate: '',
    credentialURL: '',
    doesNotExpire: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [originalCertifications, setOriginalCertifications] = useState([]);

  // Cập nhật state khi data prop thay đổi
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setCertifications(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const updatedCertification = {
      ...currentCertification,
      [name]: newValue
    };
    setCurrentCertification(updatedCertification);
    
    if (isEditing) {
      // Đang chỉnh sửa - cập nhật mục đã tồn tại
      const updatedCertifications = [...certifications];
      updatedCertifications[editIndex] = updatedCertification;
      updateData(updatedCertifications);
    } else {
      // Đang tạo mới - thêm vào mảng tạm thời để xem trước
      const tempIndex = certifications.findIndex(cert => cert._isTemp === true);
      let updatedCertifications = [...certifications];
      
      updatedCertification._isTemp = true;
      
      if (tempIndex !== -1) {
        updatedCertifications[tempIndex] = updatedCertification;
      } else {
        updatedCertifications.push(updatedCertification);
      }
      
      updateData(updatedCertifications);
    }
  };

  const validate = () => {
    return currentCertification.name && currentCertification.name.trim() !== '' && 
           currentCertification.issuer && currentCertification.issuer.trim() !== '';
  };

  const handleAddCertification = () => {
    if (validate()) {
      const { _isTemp, ...finalCertification } = currentCertification;
      
      let updatedCertifications = certifications.filter(cert => !cert._isTemp);
      updatedCertifications.push(finalCertification);
      
      setCertifications(updatedCertifications);
      updateData(updatedCertifications);
      setCurrentCertification({
        name: '',
        issuer: '',
        issueDate: '',
        expirationDate: '',
        credentialURL: '',
        doesNotExpire: false
      });
    } else {
      alert('Please provide both certification name and issuer.');
    }
  };

  const handleEdit = (index) => {
    // Lưu trạng thái certifications hiện tại trước khi chỉnh sửa
    setOriginalCertifications([...certifications]);
    setCurrentCertification(certifications[index]);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleDelete = (index) => {
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
    updateData(newCertifications);
  };

  const handleCancel = () => {
    if (isEditing) {
      // Khôi phục lại dữ liệu ban đầu trước khi chỉnh sửa
      setCertifications(originalCertifications);
      updateData(originalCertifications);
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      // Nếu đang tạo mới, xóa mục tạm thời
      const updatedCertifications = certifications.filter(cert => !cert._isTemp);
      setCertifications(updatedCertifications);
      updateData(updatedCertifications);
    }
    
    setCurrentCertification({
      name: '',
      issuer: '',
      issueDate: '',
      expirationDate: '',
      credentialURL: '',
      doesNotExpire: false
    });
  };

  const handleUpdate = () => {
    if (validate()) {
      const newCertifications = [...certifications];
      newCertifications[editIndex] = currentCertification;
      setCertifications(newCertifications);
      updateData(newCertifications);
      setCurrentCertification({
        name: '',
        issuer: '',
        issueDate: '',
        expirationDate: '',
        credentialURL: '',
        doesNotExpire: false
      });
      setEditIndex(-1);
      setIsEditing(false);
    } else {
      alert('Please provide both certification name and issuer.');
    }
  };

  return (
    <div className="space-y-6">
      {!hideTitle && <h3 className="text-lg font-medium text-gray-900 mb-3">Certifications</h3>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Certification Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={currentCertification.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., AWS Certified Solutions Architect"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Issuing Organization<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="issuer"
              value={currentCertification.issuer}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., Amazon Web Services"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Credential URL</label>
            <input
              type="text"
              name="credentialURL"
              value={currentCertification.credentialURL}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., https://www.credential.net/..."
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={currentCertification.issueDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              name="doesNotExpire"
              checked={currentCertification.doesNotExpire}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">This certification does not expire</label>
          </div>
          {!currentCertification.doesNotExpire && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={currentCertification.expirationDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Certification
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleAddCertification}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Certification
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Clear
            </button>
          </>
        )}
      </div>

      {certifications.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Certifications</h3>
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="p-4 border rounded-md bg-white">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">
                      {cert.issueDate && `Issued: ${new Date(cert.issueDate).toLocaleDateString()}`}
                      {!cert.doesNotExpire && cert.expirationDate && 
                        ` • Expires: ${new Date(cert.expirationDate).toLocaleDateString()}`}
                      {cert.doesNotExpire && ' • No Expiration'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {cert.credentialURL && (
                  <a 
                    href={cert.credentialURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-xs text-blue-600 hover:underline block"
                  >
                    View Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsStep; 