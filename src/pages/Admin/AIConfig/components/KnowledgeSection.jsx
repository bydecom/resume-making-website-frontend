import React from 'react';
import { X, Upload, Download } from "lucide-react";

const KnowledgeSection = ({
  knowledgeData,
  editedKnowledge,
  handleKnowledgeChange,
  handleQAChange,
  handleAddQA,
  handleRemoveQA,
  handleImportQA,
  handleExportCurrentData,
  handleExportQATemplate,
  fileInputRef
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Additional Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedKnowledge?.title || ''}
              onChange={(e) => handleKnowledgeChange('title', e.target.value)}
              placeholder="Enter title..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedKnowledge?.description || ''}
              onChange={(e) => handleKnowledgeChange('description', e.target.value)}
              placeholder="Enter description..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedKnowledge?.priority || 0}
              onChange={(e) => handleKnowledgeChange('priority', parseInt(e.target.value))}
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedKnowledge?.tags?.join(', ') || ''}
              onChange={(e) => handleKnowledgeChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
              placeholder="Enter tags..."
            />
          </div>
          <div className="col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={editedKnowledge?.isActive || false}
                onChange={(e) => handleKnowledgeChange('isActive', e.target.checked)}
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">General Knowledge</h3>
        <div className="bg-white p-4 rounded-md border border-gray-200">
          <textarea
            className="w-full min-h-[200px] p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={editedKnowledge?.textContent || ''}
            onChange={(e) => handleKnowledgeChange('textContent', e.target.value)}
            placeholder="Enter general knowledge content..."
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700">Q/A Content</h3>
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportQA}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 flex items-center"
            >
              <Upload className="h-4 w-4 mr-1" />
              Import JSON
            </button>
            <button
              onClick={handleExportCurrentData}
              className="px-3 py-1 text-sm font-medium rounded-md text-green-600 bg-green-50 hover:bg-green-100 border border-green-300 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Export Current
            </button>
            <button
              onClick={handleExportQATemplate}
              className="px-3 py-1 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Export Template
            </button>
            <button
              onClick={handleAddQA}
              className="px-3 py-1 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 flex items-center"
            >
              Add Q/A
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {editedKnowledge?.qaContent?.map((qa, index) => {
            const isEmpty = !qa.question && !qa.answer;
            return (
              <div 
                key={qa._id?.$oid || index} 
                className={`bg-white p-4 rounded-md border border-gray-200 hover:border-blue-300 transition-colors group relative
                  ${isEmpty ? 'hover:shadow-md cursor-text' : ''}`}
                onClick={() => {
                  if (isEmpty) {
                    const questionInput = document.getElementById(`question-${index}`);
                    if (questionInput) questionInput.focus();
                  }
                }}
              >
                {!isEmpty && (
                  <button
                    onClick={() => handleRemoveQA(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="mb-3">
                  {isEmpty || qa.isEditing ? (
                    <>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
                      <input
                        id={`question-${index}`}
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={qa.question}
                        onChange={(e) => handleQAChange(index, 'question', e.target.value)}
                        placeholder="Enter question..."
                        onFocus={() => handleQAChange(index, 'isEditing', true)}
                      />
                    </>
                  ) : (
                    <div 
                      className="group-hover:bg-gray-50 p-2 rounded cursor-text"
                      onClick={() => handleQAChange(index, 'isEditing', true)}
                    >
                      <div className="text-xs font-medium text-gray-500 mb-1">Question</div>
                      <div className="text-sm text-gray-700">{qa.question}</div>
                    </div>
                  )}
                </div>
                <div>
                  {isEmpty || qa.isEditing ? (
                    <>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={qa.answer}
                        onChange={(e) => handleQAChange(index, 'answer', e.target.value)}
                        rows={3}
                        placeholder="Enter answer..."
                        onBlur={() => {
                          if (qa.question || qa.answer) {
                            handleQAChange(index, 'isEditing', false);
                          }
                        }}
                      />
                    </>
                  ) : (
                    <div 
                      className="group-hover:bg-gray-50 p-2 rounded cursor-text"
                      onClick={() => handleQAChange(index, 'isEditing', true)}
                    >
                      <div className="text-xs font-medium text-gray-500 mb-1">Answer</div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">{qa.answer}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {(!editedKnowledge?.qaContent || editedKnowledge.qaContent.length === 0) && (
            <div 
              className="bg-white p-4 rounded-md border border-dashed border-gray-300 hover:border-blue-300 transition-colors cursor-pointer flex items-center justify-center text-gray-500 hover:text-blue-600"
              onClick={handleAddQA}
            >
              <span className="text-sm">Click to add Q/A pair</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeSection; 