// import React, { useEffect, useState, useRef } from 'react';
// import axiosInstance from "../../utils/axios";
// import Modal from '../../components/Modal';
// import { Search, Loader, Save, X, Download, Upload } from "lucide-react";
// import { toast } from 'react-toastify';

// const TABS = [
//   { key: 'basic', label: 'Basic Info' },
//   { key: 'generation', label: 'Generation Config' },
//   { key: 'safety', label: 'Safety Settings' },
//   { key: 'schema', label: 'Response Schema' },
//   { key: 'knowledge', label: 'Knowledge' },
// ];

// const TYPE_TABS = [
//   { key: 'TOOL', label: 'Tool' },
//   { key: 'CHATBOT', label: 'Chatbot' },
//   { key: 'GENERAL', label: 'General Knowledge' },
// ];

// const AIConfig = () => {
//   const [configs, setConfigs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedConfig, setSelectedConfig] = useState(null);
//   const [editedConfig, setEditedConfig] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('basic');
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeType, setActiveType] = useState('TOOL');
//   const [knowledgeData, setKnowledgeData] = useState(null);
//   const [editedKnowledge, setEditedKnowledge] = useState(null);
//   const [loadingKnowledge, setLoadingKnowledge] = useState(false);
//   const [savingKnowledge, setSavingKnowledge] = useState(false);
//   const [generalKnowledge, setGeneralKnowledge] = useState(null);
//   const [editedGeneralKnowledge, setEditedGeneralKnowledge] = useState(null);
//   const [loadingGeneralKnowledge, setLoadingGeneralKnowledge] = useState(false);

//   const fileInputRef = useRef(null);

//   // Fetch configs function
//   const fetchConfigs = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/api/admin/ai-configs');
//       setConfigs(response.data.data || []);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch AI configs.');
//       console.error('Error fetching configs:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Call fetchConfigs on mount
//   useEffect(() => {
//     fetchConfigs();
//   }, []);

//   useEffect(() => {
//     const fetchKnowledgeData = async () => {
//       if (selectedConfig && activeTab === 'knowledge') {
//         try {
//           setLoadingKnowledge(true);
//           const response = await axiosInstance.get(`/api/knowledge?taskName=${selectedConfig.taskName}&type=SPECIFIC`);
//           const data = response.data.data[0];
//           setKnowledgeData(data);
//           setEditedKnowledge(data);
//           setLoadingKnowledge(false);
//         } catch (err) {
//           console.error('Failed to fetch knowledge data:', err);
//           toast.error('Failed to fetch knowledge data');
//           setLoadingKnowledge(false);
//         }
//       }
//     };
//     fetchKnowledgeData();
//   }, [selectedConfig?.taskName, activeTab]);

//   useEffect(() => {
//     const fetchGeneralKnowledge = async () => {
//       if (activeType === 'GENERAL') {
//         try {
//           setLoadingGeneralKnowledge(true);
//           const response = await axiosInstance.get(`/api/knowledge?taskName=GENERAL&type=GENERAL`);
//           const data = response.data.data[0];
//           setGeneralKnowledge(data);
//           setEditedGeneralKnowledge(data);
//           setLoadingGeneralKnowledge(false);
//         } catch (err) {
//           console.error('Failed to fetch general knowledge data:', err);
//           toast.error('Failed to fetch general knowledge data');
//           setLoadingGeneralKnowledge(false);
//         }
//       }
//     };
//     fetchGeneralKnowledge();
//   }, [activeType]);

//   const handleKnowledgeChange = (field, value) => {
//     setEditedKnowledge(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleQAChange = (index, field, value) => {
//     setEditedKnowledge(prev => {
//       const newQAContent = [...prev.qaContent];
//       newQAContent[index] = {
//         ...newQAContent[index],
//         [field]: value
//       };
//       return {
//         ...prev,
//         qaContent: newQAContent
//       };
//     });
//   };

//   const handleAddQA = () => {
//     setEditedKnowledge(prev => {
//       const existingEmptyQA = prev.qaContent?.find(qa => !qa.question && !qa.answer);
//       if (existingEmptyQA) return prev;

//       return {
//         ...prev,
//         qaContent: [...(prev.qaContent || []), { question: '', answer: '', isEditing: true }]
//       };
//     });
//   };

//   const handleRemoveQA = (index) => {
//     setEditedKnowledge(prev => ({
//       ...prev,
//       qaContent: prev.qaContent.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       setLoading(true);

//       // Save AI Config changes
//       const configResponse = await axiosInstance.put(`/api/admin/ai-configs/${editedConfig._id}`, {
//         name: editedConfig.name,
//         description: editedConfig.description,
//         apiKey: editedConfig.apiKey,
//         modelName: editedConfig.modelName,
//         systemInstruction: editedConfig.systemInstruction,
//         taskName: editedConfig.taskName,
//         type: editedConfig.type || 'TOOL',
//         generationConfig: {
//           temperature: parseFloat(editedConfig.generationConfig?.temperature) || 0,
//           topP: parseFloat(editedConfig.generationConfig?.topP) || 0,
//           topK: parseInt(editedConfig.generationConfig?.topK) || 0,
//           maxOutputTokens: parseInt(editedConfig.generationConfig?.maxOutputTokens) || 0,
//           stopSequences: editedConfig.generationConfig?.stopSequences || [],
//           responseSchema: editedConfig.generationConfig?.responseSchema || {}
//         },
//         safetySettings: editedConfig.safetySettings || [],
//         isActive: editedConfig.isActive
//       });

//       // If we have knowledge data and it's been edited, save it too
//       if (editedKnowledge && selectedConfig?.taskName) {
//         const knowledgeResponse = await axiosInstance.put(
//           `/api/knowledge/task/${selectedConfig.taskName}`,
//           editedKnowledge
//         );
//         if (knowledgeResponse.data.status === 'success') {
//           setKnowledgeData(knowledgeResponse.data.data);
//         }
//       }

//       if (configResponse.data.success) {
//         // Fetch fresh data instead of updating local state
//         await fetchConfigs();
//         setModalOpen(false);
//         toast.success('All changes saved successfully');
//       }
//     } catch (err) {
//       console.error('Failed to save changes:', err);
//       toast.error(err.response?.data?.message || 'Failed to save changes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openDetail = (cfg) => {
//     setSelectedConfig(cfg);
//     setEditedConfig(JSON.parse(JSON.stringify(cfg))); // Deep copy for editing
//     setActiveTab('basic');
//     setModalOpen(true);
//   };

//   const handleInputChange = (field, value, section = null) => {
//     if (section) {
//       setEditedConfig(prev => ({
//         ...prev,
//         [section]: {
//           ...prev[section],
//           [field]: value
//         }
//       }));
//     } else {
//       setEditedConfig(prev => ({
//         ...prev,
//         [field]: value
//       }));
//     }
//   };

//   const handleExportQATemplate = () => {
//     const template = {
//       qaContent: Array(5).fill({ question: '', answer: '' })
//     };
    
//     const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'qa-template.json';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const handleExportCurrentData = () => {
//     if (!editedKnowledge?.qaContent?.length) {
//       toast.warning('No Q/A data to export');
//       return;
//     }
    
//     const exportData = {
//       qaContent: editedKnowledge.qaContent.map(({ question, answer }) => ({ question, answer }))
//     };
    
//     const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `qa-data-${new Date().toISOString().split('T')[0]}.json`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const handleImportQA = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const content = JSON.parse(e.target?.result || '');
//         if (Array.isArray(content.qaContent)) {
//           // Merge new data with existing data
//           setEditedKnowledge(prev => {
//             const existingQA = prev?.qaContent || [];
//             const newQA = content.qaContent.map(qa => ({
//               ...qa,
//               _id: { $oid: Math.random().toString(36).substr(2, 9) } // Generate temporary ID for new items
//             }));
            
//             return {
//               ...prev,
//               qaContent: [...existingQA, ...newQA]
//             };
//           });
//           toast.success('Q/A pairs imported and merged successfully');
//         } else {
//           toast.error('Invalid JSON format. Expected array of Q/A pairs');
//         }
//       } catch (error) {
//         toast.error('Failed to parse JSON file');
//       }
//     };
//     reader.readAsText(file);
//     // Reset file input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   // Filter configs based on search term and type
//   const filteredConfigs = configs.filter(cfg => 
//     (cfg.type === activeType) && // Filter by type
//     (cfg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     cfg.taskName?.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">AI Configurations</h1>
//           <p className="mt-2 text-sm text-gray-500">Manage and review all AI model configurations in the system</p>
//         </div>

//         {/* Type Tabs */}
//         <div className="mb-6 border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8" aria-label="Tabs">
//             {TYPE_TABS.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveType(tab.key)}
//                 className={`
//                   whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
//                   ${activeType === tab.key
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
//                 `}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Search Bar */}
//         <div className="mb-6">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by name or task name..."
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
//           {loading ? (
//             <div className="flex justify-center items-center p-12">
//               <Loader className="h-8 w-8 text-blue-500 animate-spin" />
//               <span className="ml-4 text-gray-600">Loading configurations...</span>
//             </div>
//           ) : error ? (
//             <div className="flex justify-center items-center p-12">
//               <span className="text-red-500">{error}</span>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredConfigs.map((cfg) => (
//                     <tr key={cfg._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{cfg.name}</div>
//                         <div className="text-sm text-gray-500">{cfg.taskName}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900 line-clamp-2">{cfg.taskName}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900 line-clamp-2">{cfg.description}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cfg.modelName}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {cfg.isActive ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Active
//                           </span>
//                         ) : (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                             Inactive
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{new Date(cfg.updatedAt).toLocaleDateString()}</div>
//                         <div className="text-xs text-gray-500">{new Date(cfg.updatedAt).toLocaleTimeString()}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <button
//                           onClick={() => openDetail(cfg)}
//                           className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                           Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                   {filteredConfigs.length === 0 && (
//                     <tr>
//                       <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
//                         No configurations found matching your search.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Config Detail Modal */}
//       <Modal 
//         isOpen={modalOpen} 
//         onClose={() => setModalOpen(false)} 
//         title={selectedConfig ? `${selectedConfig.name}` : ''} 
//         maxWidth="max-w-5xl"
//       >
//         {editedConfig && (
//           <div className="font-sans flex flex-col h-[calc(70vh)]">
//             {/* Tabs */}
//             <div className="flex border-b mb-2">
//               {TABS.map(tab => (
//                 <button
//                   key={tab.key}
//                   className={`px-4 font-medium focus:outline-none ${
//                     activeTab === tab.key 
//                       ? 'border-b-2 border-blue-600 text-blue-600' 
//                       : 'text-gray-600 hover:text-gray-800'
//                   }`}
//                   onClick={() => setActiveTab(tab.key)}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Tab content with fixed height and scroll */}
//             <div className="flex-1 overflow-y-auto pr-2">
//               {activeTab === 'basic' && (
//                 <div className="space-y-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Name</label>
//                     <input
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       value={editedConfig.name}
//                       onChange={(e) => handleInputChange('name', e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Task Name</label>
//                     <input
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-not-allowed sm:text-sm"
//                       value={editedConfig.taskName}
//                       readOnly
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Description</label>
//                     <textarea
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       value={editedConfig.description}
//                       onChange={(e) => handleInputChange('description', e.target.value)}
//                       rows={3}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">API Key</label>
//                     <input
//                       type="password"
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       value={editedConfig.apiKey}
//                       onChange={(e) => handleInputChange('apiKey', e.target.value)}
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Model</label>
//                       <input
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         value={editedConfig.modelName}
//                         onChange={(e) => handleInputChange('modelName', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Status</label>
//                       <select
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         value={editedConfig.isActive.toString()}
//                         onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
//                       >
//                         <option value="true">Active</option>
//                         <option value="false">Inactive</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex items-center justify-between mb-1">
//                       <label className="block text-sm font-medium text-gray-700">System Instruction</label>
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleInputChange('systemInstruction', "You are a helpful and concise virtual assistant. Please respond to the user's prompt accurately and follow any formatting instructions if provided in their request, especially if a JSON schema is specified for the response.")}
//                           className="px-3 py-1 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300"
//                         >
//                           Default
//                         </button>
//                         <button
//                           onClick={() => handleInputChange('systemInstruction', "DEMO TEST MODE 'AAA': Strictly follow the provided JSON schema. For ALL string properties, return the exact string \"aaa_[fieldName]\" (e.g., for a field named 'position', return \"aaa_position\"). For arrays of strings, each item should be \"aaa_item_[index]\". For number properties, return 0. This is for testing schema adherence.")}
//                           className="px-3 py-1 text-xs font-medium rounded-md text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-300"
//                         >
//                           Test
//                         </button>
//                       </div>
//                     </div>
//                     <textarea
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       value={editedConfig.systemInstruction}
//                       onChange={(e) => handleInputChange('systemInstruction', e.target.value)}
//                       rows={4}
//                     />
//                   </div>

//                 </div>
//               )}

//               {activeTab === 'generation' && (
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Temperature</label>
//                       <input
//                         type="number"
//                         step="0.1"
//                         min="0"
//                         max="2"
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         value={editedConfig.generationConfig?.temperature}
//                         onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value), 'generationConfig')}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Top P</label>
//                       <input
//                         type="number"
//                         step="0.1"
//                         min="0"
//                         max="1"
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         value={editedConfig.generationConfig?.topP}
//                         onChange={(e) => handleInputChange('topP', parseFloat(e.target.value), 'generationConfig')}
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Top K</label>
//                       <input
//                         type="number"
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         value={editedConfig.generationConfig?.topK}
//                         onChange={(e) => handleInputChange('topK', parseInt(e.target.value), 'generationConfig')}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Max Output Tokens</label>
//                       <input
//                         type="number"
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         value={editedConfig.generationConfig?.maxOutputTokens}
//                         onChange={(e) => handleInputChange('maxOutputTokens', parseInt(e.target.value), 'generationConfig')}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'safety' && (
//                 <div className="space-y-4">
//                   {(editedConfig.safetySettings || []).map((setting, idx) => (
//                     <div key={idx} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">Category</label>
//                         <input
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                           value={setting.category}
//                           onChange={(e) => {
//                             const newSettings = [...editedConfig.safetySettings];
//                             newSettings[idx].category = e.target.value;
//                             handleInputChange('safetySettings', newSettings);
//                           }}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">Threshold</label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                           value={setting.threshold}
//                           onChange={(e) => {
//                             const newSettings = [...editedConfig.safetySettings];
//                             newSettings[idx].threshold = e.target.value;
//                             handleInputChange('safetySettings', newSettings);
//                           }}
//                         >
//                           <option value="BLOCK_NONE">Block None</option>
//                           <option value="BLOCK_ONLY_HIGH">Block Only High</option>
//                           <option value="BLOCK_LOW_AND_ABOVE">Block Low & Above</option>
//                           <option value="BLOCK_MEDIUM_AND_ABOVE">Block Medium & Above</option>
//                         </select>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {activeTab === 'schema' && (
//                 <div className="space-y-4">
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <div className="flex justify-between items-center mb-4">
//                       <h3 className="text-sm font-medium text-gray-700">Response Schema</h3>
//                       <button
//                         onClick={() => {
//                           const schemaText = JSON.stringify(editedConfig.generationConfig?.responseSchema || {}, null, 2);
//                           navigator.clipboard.writeText(schemaText);
//                         }}
//                         className="px-3 py-1 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300"
//                       >
//                         Copy Schema
//                       </button>
//                     </div>
//                     <pre className="bg-white p-4 rounded-md border border-gray-200 overflow-auto text-sm">
//                       {JSON.stringify(editedConfig.generationConfig?.responseSchema || {}, null, 2)}
//                     </pre>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'knowledge' && (
//                 <div className="space-y-4">
//                   {loadingKnowledge ? (
//                     <div className="flex justify-center items-center p-12">
//                       <Loader className="h-8 w-8 text-blue-500 animate-spin" />
//                       <span className="ml-4 text-gray-600">Loading knowledge data...</span>
//                     </div>
//                   ) : !knowledgeData ? (
//                     <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
//                       <div className="text-gray-500 text-lg font-medium mb-2">No Knowledge Available</div>
//                       <div className="text-gray-400 text-sm">There is no knowledge content associated with this configuration.</div>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <h3 className="text-sm font-medium text-gray-700 mb-4">Additional Information</h3>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
//                             <input
//                               type="text"
//                               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                               value={editedKnowledge?.title || ''}
//                               onChange={(e) => handleKnowledgeChange('title', e.target.value)}
//                               placeholder="Enter title..."
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
//                             <input
//                               type="text"
//                               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                               value={editedKnowledge?.description || ''}
//                               onChange={(e) => handleKnowledgeChange('description', e.target.value)}
//                               placeholder="Enter description..."
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
//                             <input
//                               type="number"
//                               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                               value={editedKnowledge?.priority || 0}
//                               onChange={(e) => handleKnowledgeChange('priority', parseInt(e.target.value))}
//                               min="0"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma-separated)</label>
//                             <input
//                               type="text"
//                               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                               value={editedKnowledge?.tags?.join(', ') || ''}
//                               onChange={(e) => handleKnowledgeChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
//                               placeholder="Enter tags..."
//                             />
//                           </div>
//                           <div className="col-span-2">
//                             <label className="flex items-center space-x-2">
//                               <input
//                                 type="checkbox"
//                                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                 checked={editedKnowledge?.isActive || false}
//                                 onChange={(e) => handleKnowledgeChange('isActive', e.target.checked)}
//                               />
//                               <span className="text-sm text-gray-700">Active</span>
//                             </label>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <h3 className="text-sm font-medium text-gray-700 mb-2">General Knowledge</h3>
//                         <div className="bg-white p-4 rounded-md border border-gray-200">
//                           <textarea
//                             className="w-full min-h-[200px] p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             value={editedKnowledge?.textContent || ''}
//                             onChange={(e) => handleKnowledgeChange('textContent', e.target.value)}
//                             placeholder="Enter general knowledge content..."
//                           />
//                         </div>
//                       </div>

//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <div className="flex justify-between items-center mb-4">
//                           <h3 className="text-sm font-medium text-gray-700">Q/A Content</h3>
//                           <div className="flex space-x-2">
//                             <input
//                               type="file"
//                               ref={fileInputRef}
//                               onChange={handleImportQA}
//                               accept=".json"
//                               className="hidden"
//                             />
//                             <button
//                               onClick={() => fileInputRef.current?.click()}
//                               className="px-3 py-1 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 flex items-center"
//                             >
//                               <Upload className="h-4 w-4 mr-1" />
//                               Import JSON
//                             </button>
//                             <button
//                               onClick={handleExportCurrentData}
//                               className="px-3 py-1 text-sm font-medium rounded-md text-green-600 bg-green-50 hover:bg-green-100 border border-green-300 flex items-center"
//                             >
//                               <Download className="h-4 w-4 mr-1" />
//                               Export Current
//                             </button>
//                             <button
//                               onClick={handleExportQATemplate}
//                               className="px-3 py-1 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 flex items-center"
//                             >
//                               <Download className="h-4 w-4 mr-1" />
//                               Export Template
//                             </button>
//                             <button
//                               onClick={handleAddQA}
//                               className="px-3 py-1 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 flex items-center"
//                             >
//                               Add Q/A
//                             </button>
//                           </div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                           {editedKnowledge?.qaContent?.map((qa, index) => {
//                             const isEmpty = !qa.question && !qa.answer;
//                             return (
//                               <div 
//                                 key={qa._id?.$oid || index} 
//                                 className={`bg-white p-4 rounded-md border border-gray-200 hover:border-blue-300 transition-colors group relative
//                                   ${isEmpty ? 'hover:shadow-md cursor-text' : ''}`}
//                                 onClick={() => {
//                                   if (isEmpty) {
//                                     const questionInput = document.getElementById(`question-${index}`);
//                                     if (questionInput) questionInput.focus();
//                                   }
//                                 }}
//                               >
//                                 {!isEmpty && (
//                                   <button
//                                     onClick={() => handleRemoveQA(index)}
//                                     className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
//                                   >
//                                     <X className="h-4 w-4" />
//                                   </button>
//                                 )}
//                                 <div className="mb-3">
//                                   {isEmpty || qa.isEditing ? (
//                                     <>
//                                       <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
//                                       <input
//                                         id={`question-${index}`}
//                                         type="text"
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                         value={qa.question}
//                                         onChange={(e) => handleQAChange(index, 'question', e.target.value)}
//                                         placeholder="Enter question..."
//                                         onFocus={() => handleQAChange(index, 'isEditing', true)}
//                                       />
//                                     </>
//                                   ) : (
//                                     <div 
//                                       className="group-hover:bg-gray-50 p-2 rounded cursor-text"
//                                       onClick={() => handleQAChange(index, 'isEditing', true)}
//                                     >
//                                       <div className="text-xs font-medium text-gray-500 mb-1">Question</div>
//                                       <div className="text-sm text-gray-700">{qa.question}</div>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div>
//                                   {isEmpty || qa.isEditing ? (
//                                     <>
//                                       <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
//                                       <textarea
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                         value={qa.answer}
//                                         onChange={(e) => handleQAChange(index, 'answer', e.target.value)}
//                                         rows={3}
//                                         placeholder="Enter answer..."
//                                         onBlur={() => {
//                                           if (qa.question || qa.answer) {
//                                             handleQAChange(index, 'isEditing', false);
//                                           }
//                                         }}
//                                       />
//                                     </>
//                                   ) : (
//                                     <div 
//                                       className="group-hover:bg-gray-50 p-2 rounded cursor-text"
//                                       onClick={() => handleQAChange(index, 'isEditing', true)}
//                                     >
//                                       <div className="text-xs font-medium text-gray-500 mb-1">Answer</div>
//                                       <div className="text-sm text-gray-700 whitespace-pre-wrap">{qa.answer}</div>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           })}
                          
//                           {(!editedKnowledge?.qaContent || editedKnowledge.qaContent.length === 0) && (
//                             <div 
//                               className="bg-white p-4 rounded-md border border-dashed border-gray-300 hover:border-blue-300 transition-colors cursor-pointer flex items-center justify-center text-gray-500 hover:text-blue-600"
//                               onClick={handleAddQA}
//                             >
//                               <span className="text-sm">Click to add Q/A pair</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons - Fixed at bottom */}
//             <div className="flex justify-end space-x-3 pt-4 border-t mt-2 bg-white">
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <X className="h-4 w-4 mr-2" />
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   setEditedConfig(selectedConfig);
//                   setEditedKnowledge(knowledgeData);
//                 }}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Reset Changes
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={loading}
//                 className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
//                 <Save className="h-4 w-4 mr-2" />
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Render General Knowledge UI */}
//       {activeType === 'GENERAL' && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
//             {loadingGeneralKnowledge ? (
//               <div className="flex justify-center items-center p-12">
//                 <Loader className="h-8 w-8 text-blue-500 animate-spin" />
//                 <span className="ml-4 text-gray-600">Loading general knowledge...</span>
//               </div>
//             ) : !generalKnowledge ? (
//               <div className="flex flex-col items-center justify-center p-12 bg-gray-50">
//                 <div className="text-gray-500 text-lg font-medium mb-2">No General Knowledge Available</div>
//                 <div className="text-gray-400 text-sm">There is no general knowledge content available.</div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h3 className="text-sm font-medium text-gray-700 mb-4">Additional Information</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
//                       <input
//                         type="text"
//                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         value={editedGeneralKnowledge?.title || ''}
//                         onChange={(e) => setEditedGeneralKnowledge(prev => ({
//                           ...prev,
//                           title: e.target.value
//                         }))}
//                         placeholder="Enter title..."
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
//                       <input
//                         type="text"
//                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         value={editedGeneralKnowledge?.description || ''}
//                         onChange={(e) => setEditedGeneralKnowledge(prev => ({
//                           ...prev,
//                           description: e.target.value
//                         }))}
//                         placeholder="Enter description..."
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
//                       <input
//                         type="number"
//                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         value={editedGeneralKnowledge?.priority || 0}
//                         onChange={(e) => setEditedGeneralKnowledge(prev => ({
//                           ...prev,
//                           priority: parseInt(e.target.value)
//                         }))}
//                         min="0"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma-separated)</label>
//                       <input
//                         type="text"
//                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         value={editedGeneralKnowledge?.tags?.join(', ') || ''}
//                         onChange={(e) => setEditedGeneralKnowledge(prev => ({
//                           ...prev,
//                           tags: e.target.value.split(',').map(tag => tag.trim())
//                         }))}
//                         placeholder="Enter tags..."
//                       />
//                     </div>
//                     <div className="col-span-2">
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                           checked={editedGeneralKnowledge?.isActive || false}
//                           onChange={(e) => setEditedGeneralKnowledge(prev => ({
//                             ...prev,
//                             isActive: e.target.checked
//                           }))}
//                         />
//                         <span className="text-sm text-gray-700">Active</span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h3 className="text-sm font-medium text-gray-700 mb-2">General Knowledge</h3>
//                   <div className="bg-white p-4 rounded-md border border-gray-200">
//                     <textarea
//                       className="w-full min-h-[200px] p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       value={editedGeneralKnowledge?.textContent || ''}
//                       onChange={(e) => setEditedGeneralKnowledge(prev => ({
//                         ...prev,
//                         textContent: e.target.value
//                       }))}
//                       placeholder="Enter general knowledge content..."
//                     />
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-sm font-medium text-gray-700">Q/A Content</h3>
//                     <div className="flex space-x-2">
//                       <input
//                         type="file"
//                         ref={fileInputRef}
//                         onChange={handleImportQA}
//                         accept=".json"
//                         className="hidden"
//                       />
//                       <button
//                         onClick={() => fileInputRef.current?.click()}
//                         className="px-3 py-1 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 flex items-center"
//                       >
//                         <Upload className="h-4 w-4 mr-1" />
//                         Import JSON
//                       </button>
//                       <button
//                         onClick={handleExportCurrentData}
//                         className="px-3 py-1 text-sm font-medium rounded-md text-green-600 bg-green-50 hover:bg-green-100 border border-green-300 flex items-center"
//                       >
//                         <Download className="h-4 w-4 mr-1" />
//                         Export Current
//                       </button>
//                       <button
//                         onClick={handleExportQATemplate}
//                         className="px-3 py-1 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 flex items-center"
//                       >
//                         <Download className="h-4 w-4 mr-1" />
//                         Export Template
//                       </button>
//                       <button
//                         onClick={handleAddQA}
//                         className="px-3 py-1 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 flex items-center"
//                       >
//                         Add Q/A
//                       </button>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     {editedGeneralKnowledge?.qaContent?.map((qa, index) => {
//                       const isEmpty = !qa.question && !qa.answer;
//                       return (
//                         <div 
//                           key={qa._id?.$oid || index} 
//                           className={`bg-white p-4 rounded-md border border-gray-200 hover:border-blue-300 transition-colors group relative
//                             ${isEmpty ? 'hover:shadow-md cursor-text' : ''}`}
//                           onClick={() => {
//                             if (isEmpty) {
//                               const questionInput = document.getElementById(`question-${index}`);
//                               if (questionInput) questionInput.focus();
//                             }
//                           }}
//                         >
//                           {!isEmpty && (
//                             <button
//                               onClick={() => handleRemoveQA(index)}
//                               className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
//                             >
//                               <X className="h-4 w-4" />
//                             </button>
//                           )}
//                           <div className="mb-3">
//                             {isEmpty || qa.isEditing ? (
//                               <>
//                                 <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
//                                 <input
//                                   id={`question-${index}`}
//                                   type="text"
//                                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                   value={qa.question}
//                                   onChange={(e) => handleQAChange(index, 'question', e.target.value)}
//                                   placeholder="Enter question..."
//                                   onFocus={() => handleQAChange(index, 'isEditing', true)}
//                                 />
//                               </>
//                             ) : (
//                               <div 
//                                 className="group-hover:bg-gray-50 p-2 rounded cursor-text"
//                                 onClick={() => handleQAChange(index, 'isEditing', true)}
//                               >
//                                 <div className="text-xs font-medium text-gray-500 mb-1">Question</div>
//                                 <div className="text-sm text-gray-700">{qa.question}</div>
//                               </div>
//                             )}
//                           </div>
//                           <div>
//                             {isEmpty || qa.isEditing ? (
//                               <>
//                                 <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
//                                 <textarea
//                                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                   value={qa.answer}
//                                   onChange={(e) => handleQAChange(index, 'answer', e.target.value)}
//                                   rows={3}
//                                   placeholder="Enter answer..."
//                                   onBlur={() => {
//                                     if (qa.question || qa.answer) {
//                                       handleQAChange(index, 'isEditing', false);
//                                     }
//                                   }}
//                                 />
//                               </>
//                             ) : (
//                               <div 
//                                 className="group-hover:bg-gray-50 p-2 rounded cursor-text"
//                                 onClick={() => handleQAChange(index, 'isEditing', true)}
//                               >
//                                 <div className="text-xs font-medium text-gray-500 mb-1">Answer</div>
//                                 <div className="text-sm text-gray-700 whitespace-pre-wrap">{qa.answer}</div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
                    
//                     {(!editedGeneralKnowledge?.qaContent || editedGeneralKnowledge.qaContent.length === 0) && (
//                       <div 
//                         className="bg-white p-4 rounded-md border border-dashed border-gray-300 hover:border-blue-300 transition-colors cursor-pointer flex items-center justify-center text-gray-500 hover:text-blue-600"
//                         onClick={handleAddQA}
//                       >
//                         <span className="text-sm">Click to add Q/A pair</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Save Button */}
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     onClick={async () => {
//                       try {
//                         setSavingKnowledge(true);
//                         const response = await axiosInstance.put(
//                           `/api/knowledge/task/GENERAL`,
//                           editedGeneralKnowledge
//                         );
//                         if (response.data.status === 'success') {
//                           setGeneralKnowledge(response.data.data);
//                           toast.success('General knowledge saved successfully');
//                         }
//                       } catch (error) {
//                         console.error('Failed to save general knowledge:', error);
//                         toast.error('Failed to save general knowledge');
//                       } finally {
//                         setSavingKnowledge(false);
//                       }
//                     }}
//                     disabled={savingKnowledge}
//                     className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {savingKnowledge && <Loader className="w-4 h-4 mr-2 animate-spin" />}
//                     <Save className="h-4 w-4 mr-2" />
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AIConfig;
