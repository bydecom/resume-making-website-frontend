import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from "../../../utils/axios";
import Modal from '../../../components/Modal';
import { Search, Loader, Save, X, Download, Upload } from "lucide-react";
import { toast } from 'react-toastify';
import ConfigTable from './components/ConfigTable';
import ConfigModal from './components/ConfigModal';
import GeneralKnowledge from './components/GeneralKnowledge';

const TABS = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'generation', label: 'Generation Config' },
  { key: 'safety', label: 'Safety Settings' },
  { key: 'schema', label: 'Response Schema' },
  { key: 'knowledge', label: 'Knowledge' },
];

const TYPE_TABS = [
  { key: 'TOOL', label: 'Tool' },
  { key: 'CHATBOT', label: 'Chatbot' },
  { key: 'GENERAL', label: 'General Knowledge' },
];

const AIConfig = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [editedConfig, setEditedConfig] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState('TOOL');
  const [knowledgeData, setKnowledgeData] = useState(null);
  const [editedKnowledge, setEditedKnowledge] = useState(null);
  const [loadingKnowledge, setLoadingKnowledge] = useState(false);
  const [savingKnowledge, setSavingKnowledge] = useState(false);
  const [generalKnowledge, setGeneralKnowledge] = useState(null);
  const [editedGeneralKnowledge, setEditedGeneralKnowledge] = useState(null);
  const [loadingGeneralKnowledge, setLoadingGeneralKnowledge] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch configs function
  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/ai-configs');
      setConfigs(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch AI configs.');
      console.error('Error fetching configs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchConfigs on mount
  useEffect(() => {
    fetchConfigs();
  }, []);

  useEffect(() => {
    const fetchKnowledgeData = async () => {
      if (selectedConfig && activeTab === 'knowledge') {
        try {
          setLoadingKnowledge(true);
          const response = await axiosInstance.get(`/api/knowledge?taskName=${selectedConfig.taskName}&type=SPECIFIC`);
          const data = response.data.data[0];
          setKnowledgeData(data);
          setEditedKnowledge(data);
          setLoadingKnowledge(false);
        } catch (err) {
          console.error('Failed to fetch knowledge data:', err);
          toast.error('Failed to fetch knowledge data');
          setLoadingKnowledge(false);
        }
      }
    };
    fetchKnowledgeData();
  }, [selectedConfig?.taskName, activeTab]);

  useEffect(() => {
    const fetchGeneralKnowledge = async () => {
      if (activeType === 'GENERAL') {
        try {
          setLoadingGeneralKnowledge(true);
          const response = await axiosInstance.get(`/api/knowledge?taskName=GENERAL&type=GENERAL`);
          const data = response.data.data[0];
          setGeneralKnowledge(data);
          setEditedGeneralKnowledge(data);
          setLoadingGeneralKnowledge(false);
        } catch (err) {
          console.error('Failed to fetch general knowledge data:', err);
          toast.error('Failed to fetch general knowledge data');
          setLoadingGeneralKnowledge(false);
        }
      }
    };
    fetchGeneralKnowledge();
  }, [activeType]);

  const handleKnowledgeChange = (field, value) => {
    setEditedKnowledge(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQAChange = (index, field, value) => {
    setEditedKnowledge(prev => {
      const newQAContent = [...prev.qaContent];
      newQAContent[index] = {
        ...newQAContent[index],
        [field]: value
      };
      return {
        ...prev,
        qaContent: newQAContent
      };
    });
  };

  const handleAddQA = () => {
    setEditedKnowledge(prev => {
      const existingEmptyQA = prev.qaContent?.find(qa => !qa.question && !qa.answer);
      if (existingEmptyQA) return prev;

      return {
        ...prev,
        qaContent: [...(prev.qaContent || []), { question: '', answer: '', isEditing: true }]
      };
    });
  };

  const handleRemoveQA = (index) => {
    setEditedKnowledge(prev => ({
      ...prev,
      qaContent: prev.qaContent.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Save AI Config changes
      const configResponse = await axiosInstance.put(`/api/admin/ai-configs/${editedConfig._id}`, {
        name: editedConfig.name,
        description: editedConfig.description,
        apiKey: editedConfig.apiKey,
        modelName: editedConfig.modelName,
        systemInstruction: editedConfig.systemInstruction,
        taskName: editedConfig.taskName,
        type: editedConfig.type || 'TOOL',
        generationConfig: {
          temperature: parseFloat(editedConfig.generationConfig?.temperature) || 0,
          topP: parseFloat(editedConfig.generationConfig?.topP) || 0,
          topK: parseInt(editedConfig.generationConfig?.topK) || 0,
          maxOutputTokens: parseInt(editedConfig.generationConfig?.maxOutputTokens) || 0,
          stopSequences: editedConfig.generationConfig?.stopSequences || [],
          responseSchema: editedConfig.generationConfig?.responseSchema || {}
        },
        safetySettings: editedConfig.safetySettings || [],
        isActive: editedConfig.isActive
      });

      // If we have knowledge data and it's been edited, save it too
      if (editedKnowledge && selectedConfig?.taskName) {
        const knowledgeResponse = await axiosInstance.put(
          `/api/knowledge/task/${selectedConfig.taskName}`,
          editedKnowledge
        );
        if (knowledgeResponse.data.status === 'success') {
          setKnowledgeData(knowledgeResponse.data.data);
        }
      }

      if (configResponse.data.success) {
        // Fetch fresh data instead of updating local state
        await fetchConfigs();
        setModalOpen(false);
        toast.success('All changes saved successfully');
      }
    } catch (err) {
      console.error('Failed to save changes:', err);
      toast.error(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (cfg) => {
    setSelectedConfig(cfg);
    setEditedConfig(JSON.parse(JSON.stringify(cfg))); // Deep copy for editing
    setActiveTab('basic');
    setModalOpen(true);
  };

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

  const handleExportQATemplate = () => {
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

  const handleExportCurrentData = () => {
    if (!editedKnowledge?.qaContent?.length) {
      toast.warning('No Q/A data to export');
      return;
    }
    
    const exportData = {
      qaContent: editedKnowledge.qaContent.map(({ question, answer }) => ({ question, answer }))
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

  const handleImportQA = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result || '');
        if (Array.isArray(content.qaContent)) {
          // Merge new data with existing data
          setEditedKnowledge(prev => {
            const existingQA = prev?.qaContent || [];
            const newQA = content.qaContent.map(qa => ({
              ...qa,
              _id: { $oid: Math.random().toString(36).substr(2, 9) } // Generate temporary ID for new items
            }));
            
            return {
              ...prev,
              qaContent: [...existingQA, ...newQA]
            };
          });
          toast.success('Q/A pairs imported and merged successfully');
        } else {
          toast.error('Invalid JSON format. Expected array of Q/A pairs');
        }
      } catch (error) {
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filter configs based on search term and type
  const filteredConfigs = configs.filter(cfg => 
    (cfg.type === activeType) && // Filter by type
    (cfg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cfg.taskName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI Configurations</h1>
          <p className="mt-2 text-sm text-gray-500">Manage and review all AI model configurations in the system</p>
        </div>

        {/* Type Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveType(tab.key)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeType === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeType !== 'GENERAL' && (
          <>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or task name..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

            {/* Config Table */}
            <ConfigTable
              loading={loading}
              error={error}
              filteredConfigs={filteredConfigs}
              openDetail={openDetail}
                                      />
                                    </>
        )}

        {/* General Knowledge Section */}
      {activeType === 'GENERAL' && (
          <GeneralKnowledge
            loadingGeneralKnowledge={loadingGeneralKnowledge}
            generalKnowledge={generalKnowledge}
            editedGeneralKnowledge={editedGeneralKnowledge}
            setEditedGeneralKnowledge={setEditedGeneralKnowledge}
            setGeneralKnowledge={setGeneralKnowledge}
            handleQAChange={handleQAChange}
            handleAddQA={handleAddQA}
            handleRemoveQA={handleRemoveQA}
            handleImportQA={handleImportQA}
            handleExportCurrentData={handleExportCurrentData}
            handleExportQATemplate={handleExportQATemplate}
            savingKnowledge={savingKnowledge}
            setSavingKnowledge={setSavingKnowledge}
            fileInputRef={fileInputRef}
          />
        )}

        {/* Config Modal */}
        <ConfigModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          selectedConfig={selectedConfig}
          editedConfig={editedConfig}
          setEditedConfig={setEditedConfig}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loading={loading}
          handleSave={handleSave}
          knowledgeData={knowledgeData}
          editedKnowledge={editedKnowledge}
          setEditedKnowledge={setEditedKnowledge}
          loadingKnowledge={loadingKnowledge}
          handleKnowledgeChange={handleKnowledgeChange}
          handleQAChange={handleQAChange}
          handleAddQA={handleAddQA}
          handleRemoveQA={handleRemoveQA}
          handleImportQA={handleImportQA}
          handleExportCurrentData={handleExportCurrentData}
          handleExportQATemplate={handleExportQATemplate}
          fileInputRef={fileInputRef}
                    />
                  </div>
    </div>
  );
};

export default AIConfig;
