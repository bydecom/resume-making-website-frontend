import React, { useState, useEffect } from 'react';
import { Loader, Save, X, Upload, Download, Plus } from "lucide-react";
import { toast } from 'react-toastify';
import api, { callApi } from "../../../../utils/api";

const GeneralKnowledge = ({
  loadingGeneralKnowledge,
  generalKnowledge,
  editedGeneralKnowledge,
  setEditedGeneralKnowledge,
  setGeneralKnowledge,
  savingKnowledge,
  setSavingKnowledge,
  fileInputRef
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQA, setNewQA] = useState({ question: '', answer: '' });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleKnowledgeChange = (field, value) => {
    setEditedGeneralKnowledge(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleQAChange = (index, field, value) => {
    setEditedGeneralKnowledge(prev => {
      const newQAContent = [...(prev?.qaContent || [])];
      newQAContent[index] = {
        ...newQAContent[index],
        [field]: value
      };
      return {
        ...prev,
        qaContent: newQAContent
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleAddNewQA = () => {
    if (!newQA.question.trim() || !newQA.answer.trim()) {
      toast.warning('Please fill in both question and answer');
      return;
    }

    setEditedGeneralKnowledge(prev => ({
      ...prev,
      qaContent: [newQA, ...(prev?.qaContent || [])]
    }));
    setHasUnsavedChanges(true);
    setNewQA({ question: '', answer: '' });
    setIsModalOpen(false);
  };

  const handleAddQA = () => {
    setIsModalOpen(true);
  };

  const handleRemoveQA = (index) => {
    setEditedGeneralKnowledge(prev => ({
      ...prev,
      qaContent: prev.qaContent.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const handleExportTemplate = () => {
    const template = {
      qaContent: Array(5).fill({ question: '', answer: '' })
    };
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qa-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCurrent = () => {
    if (!editedGeneralKnowledge?.qaContent?.length) {
      toast.warning('No Q/A data to export');
      return;
    }
    
    const exportData = {
      qaContent: editedGeneralKnowledge.qaContent.map(({ question, answer }) => ({ question, answer }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result || '');
        if (Array.isArray(content.qaContent)) {
          setEditedGeneralKnowledge(prev => ({
            ...prev,
            qaContent: [...(prev?.qaContent || []), ...content.qaContent]
          }));
          toast.success('Q/A pairs imported successfully');
        } else {
          toast.error('Invalid JSON format');
        }
      } catch (error) {
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      setSavingKnowledge(true);
      const response = await callApi(
        `/api/knowledge/task/GENERAL`,
        'PUT',
        editedGeneralKnowledge
      );
      if (response.status === 'success') {
        setGeneralKnowledge(response.data);
        setHasUnsavedChanges(false);
        toast.success('General knowledge saved successfully');
      }
    } catch (error) {
      console.error('Failed to save general knowledge:', error);
      toast.error('Failed to save general knowledge');
    } finally {
      setSavingKnowledge(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Save Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={savingKnowledge}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {savingKnowledge && <Loader className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        {loadingGeneralKnowledge ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-4 text-gray-600">Loading general knowledge...</span>
          </div>
        ) : (
          <div className="p-6">
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={editedGeneralKnowledge?.title || ''}
                    onChange={(e) => handleKnowledgeChange('title', e.target.value)}
                    placeholder="Enter title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={editedGeneralKnowledge?.description || ''}
                    onChange={(e) => handleKnowledgeChange('description', e.target.value)}
                    placeholder="Enter description..."
                  />
                </div>
              </div>
            </div>

            {/* General Text Content */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Content</h3>
              <textarea
                className="w-full min-h-[200px] p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={editedGeneralKnowledge?.textContent || ''}
                onChange={(e) => handleKnowledgeChange('textContent', e.target.value)}
                placeholder="Enter general knowledge content..."
              />
            </div>

            {/* Q/A Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900">Q/A Pairs</h3>
                  {hasUnsavedChanges && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Save Changes before Leave
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </button>
                  <button
                    onClick={handleExportCurrent}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                  <button
                    onClick={handleExportTemplate}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Template
                  </button>
                  <button
                    onClick={handleAddQA}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Q/A
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {editedGeneralKnowledge?.qaContent?.slice().reverse().map((qa, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                    <button
                      onClick={() => handleRemoveQA(editedGeneralKnowledge.qaContent.length - 1 - index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={qa.question || ''}
                        onChange={(e) => handleQAChange(editedGeneralKnowledge.qaContent.length - 1 - index, 'question', e.target.value)}
                        placeholder="Enter question..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={qa.answer || ''}
                        onChange={(e) => handleQAChange(editedGeneralKnowledge.qaContent.length - 1 - index, 'answer', e.target.value)}
                        rows={3}
                        placeholder="Enter answer..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Q/A Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Q/A Pair</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewQA({ question: '', answer: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newQA.question}
                  onChange={(e) => setNewQA(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter question..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newQA.answer}
                  onChange={(e) => setNewQA(prev => ({ ...prev, answer: e.target.value }))}
                  rows={4}
                  placeholder="Enter answer..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewQA({ question: '', answer: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewQA}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Q/A
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thêm modal xác nhận khi người dùng cố gắng rời đi */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have unsaved changes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralKnowledge; 