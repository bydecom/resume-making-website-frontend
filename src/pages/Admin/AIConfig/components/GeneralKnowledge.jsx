import React from 'react';
import { Loader, Save } from "lucide-react";
import { toast } from 'react-toastify';
import axiosInstance from "../../../../utils/axios";
import KnowledgeSection from './KnowledgeSection';

const GeneralKnowledge = ({
  loadingGeneralKnowledge,
  generalKnowledge,
  editedGeneralKnowledge,
  setEditedGeneralKnowledge,
  setGeneralKnowledge,
  handleQAChange,
  handleAddQA,
  handleRemoveQA,
  handleImportQA,
  handleExportCurrentData,
  handleExportQATemplate,
  savingKnowledge,
  setSavingKnowledge,
  fileInputRef
}) => {
  const handleKnowledgeChange = (field, value) => {
    setEditedGeneralKnowledge(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSavingKnowledge(true);
      const response = await axiosInstance.put(
        `/api/knowledge/task/GENERAL`,
        editedGeneralKnowledge
      );
      if (response.data.status === 'success') {
        setGeneralKnowledge(response.data.data);
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
        ) : !generalKnowledge ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50">
            <div className="text-gray-500 text-lg font-medium mb-2">No General Knowledge Available</div>
            <div className="text-gray-400 text-sm">There is no general knowledge content available.</div>
          </div>
        ) : (
          <KnowledgeSection
            knowledgeData={generalKnowledge}
            editedKnowledge={editedGeneralKnowledge}
            handleKnowledgeChange={handleKnowledgeChange}
            handleQAChange={handleQAChange}
            handleAddQA={handleAddQA}
            handleRemoveQA={handleRemoveQA}
            handleImportQA={handleImportQA}
            handleExportCurrentData={handleExportCurrentData}
            handleExportQATemplate={handleExportQATemplate}
            fileInputRef={fileInputRef}
          />
        )}
      </div>
    </div>
  );
};

export default GeneralKnowledge; 