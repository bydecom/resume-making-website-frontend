import React from 'react';
import { X, Loader, Save } from "lucide-react";
import Modal from '../../../../components/Modal';
import KnowledgeSection from './KnowledgeSection';

const TABS = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'generation', label: 'Generation Config' },
  { key: 'safety', label: 'Safety Settings' },
  { key: 'schema', label: 'Response Schema' },
  { key: 'knowledge', label: 'Knowledge' },
];

const ConfigModal = ({
  modalOpen,
  setModalOpen,
  selectedConfig,
  editedConfig,
  setEditedConfig,
  activeTab,
  setActiveTab,
  loading,
  handleSave,
  knowledgeData,
  editedKnowledge,
  setEditedKnowledge,
  loadingKnowledge,
  handleKnowledgeChange,
  handleQAChange,
  handleAddQA,
  handleRemoveQA,
  handleImportQA,
  handleExportCurrentData,
  handleExportQATemplate,
  fileInputRef
}) => {
  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setEditedConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setEditedConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <Modal 
      isOpen={modalOpen} 
      onClose={() => setModalOpen(false)} 
      title={selectedConfig ? `${selectedConfig.name}` : ''} 
      maxWidth="max-w-5xl"
    >
      {editedConfig && (
        <div className="font-sans flex flex-col h-[calc(70vh)]">
          {/* Tabs */}
          <div className="flex border-b mb-2">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`px-4 font-medium focus:outline-none ${
                  activeTab === tab.key 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content with fixed height and scroll */}
          <div className="flex-1 overflow-y-auto pr-2">
            {activeTab === 'basic' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={editedConfig.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Name</label>
                  <input
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-not-allowed sm:text-sm"
                    value={editedConfig.taskName}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={editedConfig.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">API Key</label>
                  <input
                    type="password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={editedConfig.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedConfig.modelName}
                      onChange={(e) => handleInputChange('modelName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedConfig.isActive.toString()}
                      onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">System Instruction</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleInputChange('systemInstruction', "You are a helpful and concise virtual assistant. Please respond to the user's prompt accurately and follow any formatting instructions if provided in their request, especially if a JSON schema is specified for the response.")}
                        className="px-3 py-1 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300"
                      >
                        Default
                      </button>
                      <button
                        onClick={() => handleInputChange('systemInstruction', "DEMO TEST MODE 'AAA': Strictly follow the provided JSON schema. For ALL string properties, return the exact string \"aaa_[fieldName]\" (e.g., for a field named 'position', return \"aaa_position\"). For arrays of strings, each item should be \"aaa_item_[index]\". For number properties, return 0. This is for testing schema adherence.")}
                        className="px-3 py-1 text-xs font-medium rounded-md text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-300"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={editedConfig.systemInstruction}
                    onChange={(e) => handleInputChange('systemInstruction', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {activeTab === 'generation' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Temperature</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedConfig.generationConfig?.temperature}
                      onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value), 'generationConfig')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Top P</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedConfig.generationConfig?.topP}
                      onChange={(e) => handleInputChange('topP', parseFloat(e.target.value), 'generationConfig')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Top K</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedConfig.generationConfig?.topK}
                      onChange={(e) => handleInputChange('topK', parseInt(e.target.value), 'generationConfig')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Output Tokens</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedConfig.generationConfig?.maxOutputTokens}
                      onChange={(e) => handleInputChange('maxOutputTokens', parseInt(e.target.value), 'generationConfig')}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-4">
                {(editedConfig.safetySettings || []).map((setting, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <input
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={setting.category}
                        onChange={(e) => {
                          const newSettings = [...editedConfig.safetySettings];
                          newSettings[idx].category = e.target.value;
                          handleInputChange('safetySettings', newSettings);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Threshold</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={setting.threshold}
                        onChange={(e) => {
                          const newSettings = [...editedConfig.safetySettings];
                          newSettings[idx].threshold = e.target.value;
                          handleInputChange('safetySettings', newSettings);
                        }}
                      >
                        <option value="BLOCK_NONE">Block None</option>
                        <option value="BLOCK_ONLY_HIGH">Block Only High</option>
                        <option value="BLOCK_LOW_AND_ABOVE">Block Low & Above</option>
                        <option value="BLOCK_MEDIUM_AND_ABOVE">Block Medium & Above</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'schema' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Response Schema</h3>
                    <button
                      onClick={() => {
                        const schemaText = JSON.stringify(editedConfig.generationConfig?.responseSchema || {}, null, 2);
                        navigator.clipboard.writeText(schemaText);
                      }}
                      className="px-3 py-1 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300"
                    >
                      Copy Schema
                    </button>
                  </div>
                  <pre className="bg-white p-4 rounded-md border border-gray-200 overflow-auto text-sm">
                    {JSON.stringify(editedConfig.generationConfig?.responseSchema || {}, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-4">
                {loadingKnowledge ? (
                  <div className="flex justify-center items-center p-12">
                    <Loader className="h-8 w-8 text-blue-500 animate-spin" />
                    <span className="ml-4 text-gray-600">Loading knowledge data...</span>
                  </div>
                ) : !knowledgeData ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-50">
                    <div className="text-gray-500 text-lg font-medium mb-2">No Knowledge Available</div>
                    <div className="text-gray-400 text-sm">There is no knowledge content associated with this configuration.</div>
                  </div>
                ) : (
                  <KnowledgeSection
                    knowledgeData={knowledgeData}
                    editedKnowledge={editedKnowledge}
                    handleKnowledgeChange={handleKnowledgeChange}
                    handleQAChange={handleQAChange}
                    handleAddQA={handleAddQA}
                    handleRemoveQA={handleRemoveQA}
                    handleImportQA={handleImportQA}
                    handleExportCurrentData={handleExportCurrentData}
                    handleExportQATemplate={handleExportQATemplate}
                    handleSave={handleSave}
                    isSaving={loading}
                    fileInputRef={fileInputRef}
                  />
                )}
              </div>
            )}
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-2 bg-white">
            <button
              onClick={() => setModalOpen(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={() => {
                setEditedConfig(selectedConfig);
                setEditedKnowledge(knowledgeData);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Changes
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ConfigModal; 